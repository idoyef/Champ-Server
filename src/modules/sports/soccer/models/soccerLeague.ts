export class SoccerLeague {
  id!: Number;
  name!: String;
  country!: String;
  logo!: String;
  flag!: String;

  constructor(fields: {
    id: Number;
    name: String;
    country: String;
    logo: String;
    flag: String;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
