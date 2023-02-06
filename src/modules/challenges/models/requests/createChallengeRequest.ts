import { ChallengeType } from '../../enums/challengeType';
import { ParticipantsGuess } from '../../../tournaments/models/participantsBet';

export class CreateChallengeRequest {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  type!: ChallengeType;
  participantsGuess!: ParticipantsGuess;
  bet!: number;

  constructor(fields?: { type: ChallengeType; participantsGuess: ParticipantsGuess; bet: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
