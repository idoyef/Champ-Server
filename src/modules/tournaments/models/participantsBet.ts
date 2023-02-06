import { ChallengeResult } from '../../challenges/types/challengeResult';

export class ParticipantsGuess {
  [key: string]: ChallengeResult; // represents matchResult: [userId1, userId2...]

  constructor(fields?: { [key: string]: ChallengeResult }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
