import { ChallengeType } from '../../enums/ChallengeType';
import { ChallengeStatus } from '../../enums/ChallengeStatus';
// import { TriggeredEventType } from '../../../../common/enums/triggeredEventType';
import { ParticipantsScore } from '../../../tournaments/models/participantsScore';
import { BaseDbEntity } from '../../../../common/mongo/baseDbEntity';
import { ChallengeResult } from '../../types/challengeResult';
import { ParticipantsGuess } from '../participantsGuess';

export type DbChallenge = Challenge & BaseDbEntity;

export interface Challenge {
  type: ChallengeType;
  // resultTriggerType: TriggeredEventType;
  participantsGuess: ParticipantsGuess;
  challengeParticipantsScore: ParticipantsScore;
  score: number;
  result: ChallengeResult;
  status: ChallengeStatus;
  options?: any;
}
