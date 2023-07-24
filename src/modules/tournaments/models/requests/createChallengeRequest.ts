import { ChallengeType } from '../../../matches/enums/ChallengeType';
import { ParticipantsGuess } from '../../../matches/models/participantsGuess';

export interface CreateChallengeRequest {
  type: ChallengeType;
  participantsGuess: ParticipantsGuess;
  score: number;
}
