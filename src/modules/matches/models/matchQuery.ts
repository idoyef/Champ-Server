import { SportType } from "../../../common/enums/sportType";

export class MatchQuery {
  id!: string;
  matchId!: string;
  from!: Date;
  to!: Date;
  status!: string;
  type!: SportType;

  constructor(fields?: {
    id?: string;
    matchId?: string;
    from?: Date;
    to?: Date;
    status?: string;
    type?: SportType;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
