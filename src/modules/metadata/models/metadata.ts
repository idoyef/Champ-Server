export class Metadata {
  id!: string;
  service!: string;
  lastDateUpdated!: Date;

  constructor(fields: { service: string; lastDateUpdated: Date }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
