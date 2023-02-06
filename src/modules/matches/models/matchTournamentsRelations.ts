export class MatchTournamentsRelations {
  id!: string;
  matchId!: String;
  tournamentIds: String[] = [];

  constructor(fields?: { matchId: String; tournamentIds?: String[] }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
