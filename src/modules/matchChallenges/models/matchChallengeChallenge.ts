import { ChallengeType } from '../../challenges/enums/challengeType';
import { TriggeredEventType } from '../../../common/enums/triggeredEventType';

export class MatchChallengeChallenge {
  challengeId!: string;
  challengeType!: ChallengeType;
  resultTriggerType!: TriggeredEventType;

  constructor(fields?: { challengeId: string; challengeType: ChallengeType; resultTriggerType: TriggeredEventType }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
