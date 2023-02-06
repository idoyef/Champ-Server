import { TournamentQuery } from './models/tournamentQuery';
import { TournamentStatus } from './enums/tournamentStatus';
import { MatchService } from '../matches/matchService';
import { CreateTournamentRequest } from './models/requests/createTournamentRequest';
import { CreateMatchChallengeRequest } from '../matchChallenges/models/requests/createMatchChallengeRequest';
import { UpdateTournamentRequest } from './models/requests/updateTournamentRequest';
import { TournamentMatchChallenge } from './models/tournamentMatchChallenge';
import { MatchChallengeService } from '../matchChallenges/matchChallengeService';
import { DbTournamentBase } from './models/database/dbTournamentBase';
import { ChallengeService } from '../challenges/challengeService';
import { MatchTriggeredEvent } from '../../common/models/matchTriggeredEvent';
import { MatchStatus } from '../matches/enums/matchStatus';
import { MatchQuery } from '../matches/models/matchQuery';
import { TournamentType } from './enums/tournamentType';
import { plainToClass } from 'class-transformer';
import { DbFirstToScoreTournamentBase } from './models/database/dbFirstToScoreTournament';
import { ParticipantsScore } from './models/participantsScore';
import { TournamentRepository } from './tournamentRepository';

export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,
    private matchService: MatchService,
    private matchChallengeService: MatchChallengeService,
    private challengeService: ChallengeService
  ) {
    this.matchService.on(
      'significantEventTriggered',
      async (event: MatchTriggeredEvent) => {
        await this.handleSignificantEventTriggered(event);
      }
    );
  }

  async createTournament(tournamentRequest: CreateTournamentRequest) {
    // TBD - validate
    const tournament = this.populateTournamentFromCreateRequest(
      tournamentRequest
    );
    tournament.matchChallenges = await this.populateTournamentMatchChallengesFromCreateRequest(
      tournamentRequest.matchChallenges
    );

    const savedTournament = await this.tournamentRepository.insert(tournament);
    await this.addTournamentIdToMatches(
      savedTournament._id,
      savedTournament.matchChallenges.map((x: any) => x.matchId)
    );

    // TBD - notify relevant users

    return savedTournament;
  }

  async getTournamentById(id: string) {
    return await this.tournamentRepository.findById(id);
  }

  async getTournamentWithQuery(query: TournamentQuery) {
    return await this.tournamentRepository.findManyWithQuery(query);
  }

  // TBD version id to prevent race condition
  async updateTournamentById(tournamentRequest: UpdateTournamentRequest) {
    // TBD - validate
    const dbTournament = await this.tournamentRepository.findById(
      tournamentRequest.id
    );
    if (!dbTournament) {
      // TBD - throw exception
    }

    dbTournament.updatedAt = new Date();
    if (
      tournamentRequest.participantIds &&
      tournamentRequest.participantIds.length > 0
    ) {
      //TBD - consider terms for joining new participants after the tournament began
      for (const id of tournamentRequest.participantIds) {
        if (!dbTournament.totalParticipantsScore[id]) {
          dbTournament.totalParticipantsScore[id] = 0;
        }
      }
    }

    if (tournamentRequest.matchChallenges) {
      const newMatchIds: string[] = [];
      for (const matchChallengeToUpdate of tournamentRequest.matchChallenges) {
        const match = await this.matchService.getMatchById(
          matchChallengeToUpdate.matchId
        );
        // if (!match || match.status !== MatchStatus.NotStarted) {
        //   // aggregate error message for client: 'cannot update match challenge, match already began'
        //   continue;
        // }

        const dbMatchChallengeIndex = dbTournament.matchChallenges.findIndex(
          (mc: any) => mc.matchId === matchChallengeToUpdate.matchId
        );

        if (dbMatchChallengeIndex === -1) {
          const newMatchChallenge = await this.matchChallengeService.addMatchChallenge(
            matchChallengeToUpdate
          );
          dbTournament.matchChallenges.push(
            new TournamentMatchChallenge({
              matchChallengeId: newMatchChallenge._id,
              matchId: matchChallengeToUpdate.matchId,
            })
          );
          newMatchIds.push(matchChallengeToUpdate.matchId);
        } else {
          // update match challenge
        }
      }
    }

    const updatedTournament = await this.tournamentRepository.updateWithSetById(
      dbTournament._id,
      dbTournament
    );

    // notify new participants on new tournament
    // notify participants on new matches added to tournament

    return updatedTournament;
  }

  private populateTournamentFromCreateRequest(
    tournamentRequest: CreateTournamentRequest
  ): DbTournamentBase {
    let result: any = {};

    result.type = tournamentRequest.type;
    result.participantIds = tournamentRequest.participantIds ?? [];
    result.totalParticipantsScore = {};
    for (const id of tournamentRequest.participantIds) {
      result.totalParticipantsScore[id] = 0;
    }
    result.status = TournamentStatus.NotStarted;

    switch (tournamentRequest.type) {
      case TournamentType.FirstToReachScore:
        result.completionScore = tournamentRequest.completionScore;
        return plainToClass(
          DbFirstToScoreTournamentBase,
          result as DbFirstToScoreTournamentBase
        );
      default:
        return plainToClass(DbTournamentBase, result as DbTournamentBase);
    }
  }

  private async populateTournamentMatchChallengesFromCreateRequest(
    matchChallenges: CreateMatchChallengeRequest[]
  ): Promise<TournamentMatchChallenge[]> {
    const result: TournamentMatchChallenge[] = [];

    if (matchChallenges && matchChallenges.length > 0) {
      for (const matchChallengeRequest of matchChallenges) {
        const query = new MatchQuery({
          matchId: matchChallengeRequest.matchId,
        });
        const match = await this.matchService.getMatchWithQuery(query);
        // if (match && match.status !== MatchStatus.NotStarted) {
        //   // aggregate error message for client: 'cannot add match challenge, match already began'
        //   continue;
        // }

        const savedMatchChallenge = await this.matchChallengeService.addMatchChallenge(
          matchChallengeRequest
        );
        result.push(
          new TournamentMatchChallenge({
            matchChallengeId: savedMatchChallenge._id,
            matchId: matchChallengeRequest.matchId,
          })
        );
      }
    }

    return result;
  }

  private async addTournamentIdToMatches(
    tournamentId: string,
    matchIds: string[]
  ) {
    for (const matchId of matchIds) {
      const match = await this.matchService.getMatchWithQuery(
        new MatchQuery({ matchId })
      );
      await this.matchService.updateMatchById(match._id, {
        $addToSet: { tournamentIds: tournamentId },
      });
    }
  }

  private async handleSignificantEventTriggered(event: MatchTriggeredEvent) {
    const relevantTournamentIds = event.tournamentIds; // TBD - also query status active

    for (const tournamentId of relevantTournamentIds) {
      // TBD handle the process with version
      const tournament = await this.getTournamentById(tournamentId);
      const tournamentMatchChallenge = tournament.matchChallenges.find(
        (x: any) => x.matchId === event.matchId
      );
      if (tournamentMatchChallenge) {
        const updatedMatchChallenge = await this.matchChallengeService.calculateAndUpdateMatchChallenge(
          tournamentMatchChallenge.matchChallengeId,
          event.events
        );

        const totalParticipantsScore =
          tournament.totalParticipantsScore ?? new ParticipantsScore({});

        for (const ps in updatedMatchChallenge.matchParticipantsScore) {
          if (updatedMatchChallenge.matchParticipantsScore[ps] > 0) {
            totalParticipantsScore[ps] = totalParticipantsScore[ps]
              ? totalParticipantsScore[ps] +
                updatedMatchChallenge.matchParticipantsScore[ps]
              : updatedMatchChallenge.matchParticipantsScore[ps];
          } else {
            totalParticipantsScore[ps] = totalParticipantsScore[ps] ?? 0;
          }
        }

        tournament.totalParticipantsScore = totalParticipantsScore;

        const checkedTournament = await this.checkAndHandleFinishedTournament(
          tournament
        );

        const updatedTournament = await this.tournamentRepository.updateWithSetById(
          tournamentId,
          checkedTournament
        );
        // retry if version does not match

        if (updatedTournament.status === TournamentStatus.Finished) {
          // handle payout
          // notify participants
        }
      }
    }
  }
  async checkAndHandleFinishedTournament(tournament: DbTournamentBase) {
    switch (tournament.type) {
      case TournamentType.FirstToReachScore:
        let winner: any = {
          score: 0,
        };
        for (const participantId in tournament.totalParticipantsScore) {
          if (
            Object.prototype.hasOwnProperty.call(
              tournament.totalParticipantsScore,
              participantId
            )
          ) {
            const score = tournament.totalParticipantsScore[participantId];
            if (
              score >=
                (tournament as DbFirstToScoreTournamentBase).completionScore &&
              score > winner.score
            ) {
              winner.id = participantId;
              winner.score = score;
            }
          }
        }

        if (winner.score > 0) {
          tournament.status = TournamentStatus.Finished;
          tournament.winnerId = winner.id;
        }
        break;

      default:
        break;
    }

    return tournament;
  }
}
