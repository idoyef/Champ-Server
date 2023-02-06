import { ChallengeService } from '../challenges/challengeService';
import { CreateMatchChallengeRequest } from './models/requests/createMatchChallengeRequest';
import { DbMatchChallenge } from './models/database/dbMatchChallenge';
import { MatchChallengeChallenge } from './models/matchChallengeChallenge';
import { MatchChallengeStatus } from './enums/matchChallengeStatus';
import { TriggeredEvent } from '../../common/models/triggeredEvent';
import { ParticipantsScore } from '../tournaments/models/participantsScore';
import { MatchChallengeRepository } from './matchChallengeRepository';

export class MatchChallengeService {
  constructor(
    private matchChallengeRepository: MatchChallengeRepository,
    private challengeService: ChallengeService
  ) {}

  async addMatchChallenge(
    matchChallengeRequest: CreateMatchChallengeRequest
  ): Promise<DbMatchChallenge> {
    // TBD - validate
    const matchChallenge = await this.populateMatchChallengeFromRequest(
      matchChallengeRequest
    );

    const savedMatchChallenge = await this.matchChallengeRepository.insert(
      matchChallenge
    );

    return savedMatchChallenge;
  }

  private async populateMatchChallengeFromRequest(
    matchChallengeRequest: CreateMatchChallengeRequest
  ): Promise<DbMatchChallenge> {
    const challenges: MatchChallengeChallenge[] = [];

    for (const challenge of matchChallengeRequest.challenges) {
      const dbChallenge = await this.challengeService.createChallenge(
        challenge
      );
      challenges.push(
        new MatchChallengeChallenge({
          challengeId: dbChallenge._id,
          challengeType: dbChallenge.type,
          resultTriggerType: dbChallenge.resultTriggerType,
        })
      );
    }
    const matchChallenge = new DbMatchChallenge({
      challenges,
      matchId: matchChallengeRequest.matchId,
      matchType: matchChallengeRequest.matchType,
      status: MatchChallengeStatus.NotStarted,
    });

    return matchChallenge;
  }

  async calculateAndUpdateMatchChallenge(
    matchChallengeId: string,
    triggeredEvents: TriggeredEvent[]
  ) {
    const dbMatchChallenge = await this.matchChallengeRepository.findById(
      matchChallengeId
    );

    if (!dbMatchChallenge) {
      // throw error
      return;
    }

    if (
      !dbMatchChallenge.challenges ||
      dbMatchChallenge.challenges.length === 0
    ) {
      return dbMatchChallenge;
    }

    const participantsScore =
      dbMatchChallenge.matchParticipantsScore ?? new ParticipantsScore({});

    for (const event of triggeredEvents) {
      const challengeIndex = dbMatchChallenge.challenges.findIndex(
        (x) => x.resultTriggerType === event.type
      );

      if (challengeIndex !== -1) {
        const updatedChallenge = await this.challengeService.calculateChallengeResult(
          dbMatchChallenge.challenges[challengeIndex].challengeId,
          dbMatchChallenge.matchType,
          event
        );

        for (const ps in updatedChallenge.challengeParticipantsScore) {
          if (updatedChallenge.challengeParticipantsScore[ps] > 0) {
            participantsScore[ps] = participantsScore[ps]
              ? participantsScore[ps] +
                updatedChallenge.challengeParticipantsScore[ps]
              : updatedChallenge.challengeParticipantsScore[ps];
          } else {
            participantsScore[ps] = participantsScore[ps] ?? 0;
          }
        }

        dbMatchChallenge.matchParticipantsScore = participantsScore;
      }
    }

    const updatedMatchChallenge = await this.matchChallengeRepository.updateWithSetById(
      dbMatchChallenge._id,
      dbMatchChallenge
    );

    // update matchChallenge scores - using version

    return updatedMatchChallenge;
  }
}
