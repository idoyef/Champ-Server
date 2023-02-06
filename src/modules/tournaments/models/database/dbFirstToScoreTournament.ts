import { DbTournamentBase } from './dbTournamentBase';

export class DbFirstToScoreTournamentBase extends DbTournamentBase {
  completionScore!: number;

  constructor(fields?: { completionScore: number }) {
    super();
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
