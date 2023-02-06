export class ParticipantsScore {
  [key: string]: number;
  // userId!: string;
  // score: number = 0;

  constructor(fields?: { [key: string]: number }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
