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
import { EventHandler } from '../../common/events/eventHandler';
import { ParticipantsScore } from './models/participantsScore';
import { CoinService } from '../coins/coinService';

export class TournamentService {
  constructor(
    private tournamentRepository: TournamentRepository,
    private matchService: MatchService,
    private coinService: CoinService,
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

  async getUserTournamentsByUserId(userId: string) {
    return []; // TBD - implement new table userTournaments
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
    const { tournamentId, matchId, participantsScore } = payload;
    let allMatchesResolved = true;

    const tournament = await this.tournamentRepository.findById(tournamentId);
    if (tournament.status === TournamentStatus.Finished) {
      return;
    }

    const updatedMatches = tournament.matches.map((match) => {
      const result =
        match.matchId === matchId ? { matchId, isResolved: true } : match;
      if (!result.isResolved) allMatchesResolved = false;

      return result;
    });

    const winnersIds = this.handleTournamentFinished(
      tournament,
      allMatchesResolved,
      participantsScore
    );

    const tournamentToUpdate = {
      ...tournament,
      matches: updatedMatches,
    };

    if (winnersIds && winnersIds.length > 0) {
      tournamentToUpdate.winnersIds = winnersIds;
      tournamentToUpdate.status = TournamentStatus.Finished;

      this.distributeCoins(winnersIds, tournament.bet);
    }

    await this.tournamentRepository.updateById(
      tournamentId,
      tournamentToUpdate
    );
  }

  private handleTournamentFinished(
    tournament: Tournament,
    allMatchesResolved: boolean,
    participantsScore: ParticipantsScore
  ): string[] | undefined {
    const { highestScore, winners } =
      this.calculateHighestScore(participantsScore);

    switch (tournament.type) {
      case TournamentType.Fixed:
      case TournamentType.SingleMatch:
        return winners;
      case TournamentType.FirstToReachScore:
        const { completionScore } = tournament as FirstToScoreTournament;
        if (highestScore >= completionScore || allMatchesResolved) {
          return winners;
        }
        return undefined;
      default:
        break;
    }
  }

  private calculateHighestScore(participantsScore: ParticipantsScore): {
    highestScore: number;
    winners: string[];
  } {
    let winners: string[] = [];
    let highestScore = 0;

    for (const participantId in participantsScore) {
      if (highestScore === participantsScore[participantId]) {
        winners.push(participantId);
      } else if (participantsScore[participantId] > highestScore) {
        highestScore = participantsScore[participantId];
        winners = [participantId];
      }
    }
    return { highestScore, winners };
  }

  private async distributeCoins(userIds: string[], coins: number) {
    const distributedCoins = this.fairCoinsDistribution(userIds, coins);

    await Promise.all(
      distributedCoins.map(({ userId, coins }) =>
        this.coinService.addCoins(userId, coins)
      )
    );
  }

  private fairCoinsDistribution(
    userIds: string[],
    coins: number
  ): { userId: string; coins: number }[] {
    const usersCopy = [...userIds];
    const baseCoins = Math.floor(coins / userIds.length);

    const lefthover = coins - baseCoins * userIds.length;
    const selectedUsers = [];

    for (let index = 0; index < lefthover; index++) {
      const rand = this.getRandomNumberInRange(1, lefthover - index);
      selectedUsers.push(userIds[rand]);
      usersCopy.splice(rand - 1, 1);
    }

    const baseDistribution = usersCopy.map((userId) => ({
      userId,
      coins: baseCoins,
    }));
    const extraDistribution = selectedUsers.map((userId) => ({
      userId,
      coins: baseCoins + 1,
    }));

    return [...baseDistribution, ...extraDistribution];
  }

  private getRandomNumberInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
