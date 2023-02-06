import { SoccerChallengeService } from './soccerChallengeService';
import { BasketballChallengeService } from './basketballChallengeService';
import { SportType } from '../../common/enums/sportType';
import { DbChallenge } from './models/database/dbChallenge';
import { CreateChallengeRequest } from './models/requests/createChallengeRequest';
import { ChallengeStatus } from './enums/challengeStatus';
import { TriggeredEvent } from '../../common/models/triggeredEvent';
import { TriggeredEventType } from '../../common/enums/triggeredEventType';
import { plainToClass } from 'class-transformer';
import { ChallengeRepository } from './challengeRepository';

export class ChallengeService {
  constructor(
    private challengeRepository: ChallengeRepository,
    private soccerChallengeService: SoccerChallengeService,
    private basketballChallengeService: BasketballChallengeService
  ) {}

  async createChallenge(challengeRequest: CreateChallengeRequest) {
    // TBD - validate
    const challenge = this.populateChallengeFromRequest(challengeRequest);
    return await this.challengeRepository.insert(challenge);
  }

  async updateChallengeWithQuery(query: any, updateObject: any) {
    // TBD - validate
    await this.challengeRepository.upsertOneWithQuery(query, updateObject);
  }

  async replaceChallengeWithQuery(id: string, challenge: DbChallenge) {
    // TBD - validate
    return await this.challengeRepository.replaceOneWithQuery(
      { type: challenge.type },
      challenge
    );
  }

  async calculateChallengeResult(
    challengeId: string,
    matchType: SportType,
    event: TriggeredEvent
  ): Promise<DbChallenge> {
    const dbChallenge = await this.challengeRepository.findById(challengeId);

    switch (matchType) {
      case SportType.Soccer:
        const result = this.soccerChallengeService.calculateMatchChallengeScoreResult(
          dbChallenge,
          event
        );
        const updatedChallenge = await this.challengeRepository.updateWithSetById(
          dbChallenge._id,
          result
        );
        return plainToClass(DbChallenge, updatedChallenge as DbChallenge);
      default:
        return dbChallenge;
    }
  }

  private populateChallengeFromRequest(
    challengeRequest: CreateChallengeRequest
  ): DbChallenge {
    return new DbChallenge({
      type: challengeRequest.type,
      resultTriggerType: TriggeredEventType.SoccerMatchEnd, // change to real trigger
      participantsGuess: challengeRequest.participantsGuess,
      challengeParticipantsScore: {},
      bet: challengeRequest.bet,
      status: ChallengeStatus.NotStarted,
    });
  }
}
