import { TournamentStatus } from './enums/tournamentStatus';
import { CreateTournamentRequest } from './models/requests/createTournamentRequest';
import { TournamentType } from './enums/TournamentType';
import { TournamentRepository } from './tournamentRepository';
import { MatchService } from '../matches/matchService';
import { TournamentQuery } from './models/tournamentQuery';
import { DbTournament } from './models/db/dbTournamentBase';
import { FirstToScoreTournament, Tournament } from './models/tournament';
import { MatchStatus } from '../matches/enums/matchStatus';
import { CreateMatchChallengeRequest } from '../matches/models/requests/createMatchChallengeRequest';
import { EventHandler } from '../../common/events/eventhandler';

export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,
    private matchService: MatchService,
    private eventHandler: EventHandler
  ) {
    this.eventHandler.on('TOURNAMENT_MATCH_FINISHED', (payload) => {
      this.handleMatchFinished(payload);
    });
  }

  async createTournament(
    tournamentRequest: CreateTournamentRequest
  ): Promise<DbTournament> {
    const tournament =
      this.populateTournamentFromCreateRequest(tournamentRequest);
    const savedTournament = await this.tournamentRepository.insert(tournament);

    await Promise.all([
      this.createMatches(savedTournament.id, tournamentRequest.matchChallenges),
      this.matchService.createMatchChallenges(
        savedTournament.id,
        tournamentRequest.matchChallenges
      ),
    ]);

    // TBD - notify relevant participants, something like: "John is inviting you to a new tournament!"

    return savedTournament;
  }

  async getTournamentById(id: string): Promise<DbTournament> {
    return await this.tournamentRepository.findById(id);
  }

  async getTournamentWithQuery(query: TournamentQuery): Promise<DbTournament> {
    return await this.tournamentRepository.findOneWithQuery(query);
  }

  private populateTournamentFromCreateRequest(
    tournamentRequest: CreateTournamentRequest
  ): Tournament {
    const { type, matchChallenges, participantIds, completionScore, bet } =
      tournamentRequest;
    const tournamentEnrich = {};

    switch (type) {
      case TournamentType.FirstToReachScore:
        if (!completionScore) {
          throw new Error(
            'missing completion score in firstToScore tournament type'
          );
        }
        (tournamentEnrich as FirstToScoreTournament).completionScore =
          completionScore;
        break;
    }

    return {
      ...tournamentEnrich,
      type,
      matches: matchChallenges.map(({ matchId }) => ({
        matchId,
        isResolved: false,
      })),
      participantIds,
      bet,
      totalParticipantsScore:
        this.participantIdsToTotalParticipantsScore(participantIds),
      status: TournamentStatus.NotStarted,
    };
  }

  private participantIdsToTotalParticipantsScore(participantIds: string[]) {
    const result: { [key: string]: number } = {};
    for (const id of participantIds) {
      result[id] = 0;
    }

    return result;
  }

  private async createMatches(
    tournamentId: string,
    matchChallenges: CreateMatchChallengeRequest[]
  ) {
    const matchesPromises = matchChallenges.map((matchChallenge) => {
      return this.matchService.createMatch({
        type: matchChallenge.matchType,
        status: MatchStatus.NotStarted,
        tournamentIds: [tournamentId],
        matchId: matchChallenge.matchId,
      });
    });

    await Promise.all(matchesPromises);
  }

  private async handleMatchFinished(payload: any) {
    const { tournamentId, matchId } = payload;

    const tournament = await this.tournamentRepository.findById(tournamentId);
    const updatedMatches = tournament.matches.map((match) => {
      return match.matchId === matchId ? { matchId, isResolved: true } : match;
    });

    await this.tournamentRepository.updateById(tournamentId, {
      ...tournament,
      matches: updatedMatches,
    });
  }
}
