import { ChallengeResult } from '../types/challengeResult';

export interface ParticipantsGuess {
  [key: string]: ChallengeResult; // represents matchResult: [userId1, userId2...]
}
