import { MatchQuery } from './models/matchQuery';
import { CreateMatchRequest } from './models/requests/createMatchRequest';
import { MatchRepository } from './matchRepository';
import { MatchChallenges } from './models/matchChallenge';
import { MatchChallengesRepository } from './matchChallengeRepository';
import { ChallengeRepository } from './challengeRepository';
import { CreateMatchChallengeRequest } from './models/requests/createMatchChallengeRequest';
import { MatchChallengeStatus } from './enums/MatchChallengeStatus';
import { EventHandler } from '../../common/events/eventHandler';
import { Challenge, DbChallenge } from './models/database/dbChallenge';
import { ChallengeStatus } from './enums/ChallengeStatus';
import { handlersMapping } from './challengeHandler';
import { MatchStatus } from './enums/matchStatus';
import { DbMatch } from './models/database/dbMatch';
import { ParticipantsScore } from '../tournaments/models/participantsScore';

export class MatchService {
  constructor(
    private matchRepository: MatchRepository,
    private matchChallengeRepository: MatchChallengesRepository,
    private challengeRepository: ChallengeRepository,
    private eventHandler: EventHandler
  ) {
    this.eventHandler.on('matchTriggers', async (payload) => {
      this.handleMatchTriggers(payload);
    });
  }

  async createMatch(matchRequest: CreateMatchRequest) {
    // TBD - validate

    const savedMatch = await this.matchRepository.insert(matchRequest);

    // notify relevant users

    return savedMatch;
  }

  async createMatchChallenges(
    tournamentId: string,
    matchChallengesRequest: CreateMatchChallengeRequest[]
  ): Promise<MatchChallenges[]> {
    // TBD - validate
    const matchChallengePromises = [];

    for (const matchChallenges of matchChallengesRequest) {
      const { matchId, challenges, matchType } = matchChallenges;

      const challengesIds = await Promise.all(
        challenges.map(async (challenge) => {
          const savedChallenge = await this.challengeRepository.insert(
            challenge
          );
          return savedChallenge.id;
        })
      );

      matchChallengePromises.push(
        this.matchChallengeRepository.insert({
          matchId,
          tournamentId,
          matchType,
          challengesIds,
          status: MatchChallengeStatus.NotStarted,
        })
      );
    }

    return await Promise.all(matchChallengePromises);
  }

  async getMatchById(id: string): Promise<DbMatch> {
    return await this.matchRepository.findById(id);
  }

  async getMatchWithQuery(query: MatchQuery) {
    return await this.matchRepository.findOneWithQuery(query);
  }

  async updateMatchById(id: string, updateObject: any) {
    // TBD - validate

    const updatedMatch = await this.matchRepository.updateById(
      id,
      updateObject
    );

    return updatedMatch;
  }

  async upsertMatchWithQuery(query: MatchQuery, upsertObject: any) {
    // TBD - validate

    const upsertMatch = await this.matchRepository.upsertOneWithQuery(
      query,
      upsertObject
    );

    return upsertMatch;
  }

  private async handleMatchTriggers(payload: any) {
    const { matchId, matchStatus, matchTrigger } = payload;

    const tournamentIdToMatchIdsMap = new Map<string, string[]>();
    const tournamentIdToMatchesResolved = new Map<string, boolean>();

    const matchChallenges =
      await this.matchChallengeRepository.findManyWithQuery({ matchId });
    const isMatchFinish = matchStatus === MatchStatus.Finished;

    matchChallenges.forEach(async (matchChallenge) => {
      const { tournamentId, matchId, challengesIds } = matchChallenge;
      const matchIds = tournamentIdToMatchIdsMap.get(
        matchChallenge.tournamentId
      );

      if (!matchIds) {
        tournamentIdToMatchIdsMap.set(tournamentId, [matchId]);
      } else {
        matchIds.push(matchId);
        tournamentIdToMatchIdsMap.set(tournamentId, matchIds);
      }

      const { challengesResolved, participantsScore } =
        await this.handleChallenges(
          matchId,
          matchStatus,
          challengesIds,
          matchTrigger
        );

      await this.upsertMatchWithQuery(
        { matchId },
        {
          challengesResolved,
          status: matchStatus,
        }
      );

      if (isMatchFinish && challengesResolved) {
        this.eventHandler.emit('TOURNAMENT_MATCH_FINISHED', {
          tournamentId,
          matchId,
          participantsScore,
        });
      }
    });
  }

  private async handleChallenges(
    matchId: string,
    matchStatus: MatchStatus,
    challengeIds: string[],
    matchTriggers: any
  ): Promise<{
    challengesResolved: boolean;
    participantsScore: ParticipantsScore;
  }> {
    let challengesResolved = true;
    let participantsScore: ParticipantsScore = {};

    for (const challengesId of challengeIds) {
      const challenge = await this.challengeRepository.findById(challengesId);

      const handledChallenge = await this.handleChallenge(
        matchId,
        matchStatus,
        challenge,
        matchTriggers
      );

      for (const participantId in handledChallenge.challengeParticipantsScore) {
        if (participantsScore[participantId]) {
          participantsScore[participantId] =
            participantsScore[participantId] +
            handledChallenge.challengeParticipantsScore[participantId];
        } else {
          participantsScore[participantId] =
            handledChallenge.challengeParticipantsScore[participantId];
        }
      }

      if (handledChallenge.status !== ChallengeStatus.Finished) {
        challengesResolved = false;
      }
    }

    return { challengesResolved, participantsScore };
  }

  private async handleChallenge(
    matchId: string,
    matchStatus: MatchStatus,
    challenge: DbChallenge,
    matchTriggers: any
  ): Promise<DbChallenge> {
    const match = await this.matchRepository.findOneWithQuery({ matchId });
    const handler = handlersMapping[match.type];

    const { challengeParticipantsScore, challengeStatus } =
      handler.handleMatchTriggers(matchStatus, challenge, matchTriggers);
    const updateChallenge: Challenge = {
      ...challenge,
      challengeParticipantsScore,
      status: challengeStatus,
    };

    return await this.challengeRepository.updateById(
      challenge.id,
      updateChallenge
    );
  }
}
