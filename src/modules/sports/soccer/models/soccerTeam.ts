export class SoccerTeam {
  id!: number;
  name!: string;
  logo!: string;

  constructor(fields?: { id: number; name: string; logo: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
