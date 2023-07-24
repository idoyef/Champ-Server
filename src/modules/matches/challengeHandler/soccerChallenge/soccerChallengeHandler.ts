import {
  MatchTrigger,
  SoccerMatchTrigger,
} from '../../../../common/enums/matchTrigger';
import { ChallengeStatus } from '../../enums/ChallengeStatus';
import { ChallengeType } from '../../enums/ChallengeType';
import { MatchStatus } from '../../enums/matchStatus';
import { DbChallenge } from '../../models/database/dbChallenge';
import * as challengeHandlers from './handlers';

class SoccerChallengeHandler {
  handleMatchTriggers(
    matchStatus: MatchStatus,
    challenge: DbChallenge,
    matchTrigger: MatchTrigger<SoccerMatchTrigger>
  ): { challengeParticipantsScore: any; challengeStatus: ChallengeStatus } {
    const { type: challengeType } = challenge;
    const { type, payload } = matchTrigger;

    const handler = this.getChallengeHandler(challengeType);
    const { challengeParticipantsScore, challengeStatus } = handler(
      matchStatus,
      challenge,
      type,
      payload
    );

    return {
      challengeParticipantsScore,
      challengeStatus,
    };
  }

  private getChallengeHandler(challengeType: ChallengeType) {
    const challengeName =
      challengeType.charAt(0).toLowerCase() +
      challengeType.slice(1) +
      'Handler';

    return (challengeHandlers as any)[challengeName];
  }
}

export const soccerChallengeHandler = new SoccerChallengeHandler();
