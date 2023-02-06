export class TournamentMatchChallenge {
  matchChallengeId!: string;
  matchId!: string;

  constructor(fields?: { matchChallengeId: string; matchId: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
