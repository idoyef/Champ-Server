export class SoccerTime {
  elapsed!: number;
  extra!: number;

  constructor(fields?: { elapsed: number; extra: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
