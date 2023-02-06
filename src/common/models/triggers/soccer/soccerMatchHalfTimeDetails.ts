export class SoccerMatchHalfTimeDetails {
  homeScore!: number;
  awayScore!: number;

  constructor(fields?: { homeScore: number; awayScore: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
