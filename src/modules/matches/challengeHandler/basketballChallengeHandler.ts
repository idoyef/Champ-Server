import { ChallengeStatus } from '../enums/ChallengeStatus';
import { MatchStatus } from '../enums/matchStatus';
import { DbChallenge } from '../models/database/dbChallenge';

class BasketballChallengeHandler {
  handleMatchTriggers(
    matchStatus: MatchStatus,
    challenge: DbChallenge,
    matchTriggers: any
  ): { challengeParticipantsScore: any; challengeStatus: ChallengeStatus } {
    return {
      challengeParticipantsScore: {},
      challengeStatus: ChallengeStatus.NotStarted,
    };
  }
}

export const basketballChallengeHandler = new BasketballChallengeHandler();
