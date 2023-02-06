export class TournamentQuery {
  id!: string;
  username!: string;

  constructor(fields?: { id?: string; username?: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
