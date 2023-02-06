import { ChallengeResult } from '../../challenges/types/challengeResult';

export class ParticipantBet {
  userId!: string;
  challengeResult!: ChallengeResult;

  constructor(fields?: { userId: string; challengeResult: ChallengeResult }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
