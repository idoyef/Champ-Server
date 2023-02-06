export class MatchChallengeScoreResult {
  userId!: string;
  points: number = 0;

  constructor(fields?: { userId: string; points: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
