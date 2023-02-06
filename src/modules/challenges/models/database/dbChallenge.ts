import { ChallengeType } from '../../enums/challengeType';
import { ChallengeStatus } from '../../enums/challengeStatus';
import { ChallengeResult } from '../../types/challengeResult';
import { ParticipantsGuess } from '../../../tournaments/models/participantsBet';
import { TriggeredEventType } from '../../../../common/enums/triggeredEventType';
import { ParticipantsScore } from '../../../tournaments/models/participantsScore';

export class DbChallenge {
  _id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  type!: ChallengeType;
  resultTriggerType!: TriggeredEventType;
  participantsGuess!: ParticipantsGuess;
  challengeParticipantsScore!: ParticipantsScore;

  bet!: number;
  result!: ChallengeResult;
  status!: ChallengeStatus;

  constructor(fields?: {
    type: ChallengeType;
    resultTriggerType: TriggeredEventType;
    participantsGuess?: ParticipantsGuess;
    challengeParticipantsScore: ParticipantsScore;

    bet: number;
    result?: ChallengeResult;
    status: ChallengeStatus;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
