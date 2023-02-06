import { ParticipantsGuess } from '../../tournaments/models/participantsBet';

export class ChallengeGuess {
  participantsGuess!: ParticipantsGuess;
  bet!: number;

  constructor(fields?: { participantsGuess: ParticipantsGuess; bet: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
