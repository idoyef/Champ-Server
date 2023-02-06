import { SportType } from '../../../../common/enums/sportType';
import { TriggeredEvent } from '../../../../common/models/triggeredEvent';
import { MatchStatus } from '../../enums/matchStatus';

export class DbMatch {
  _id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  type!: SportType;
  status!: MatchStatus;
  tournamentIds!: string[];
  matchId!: String;
  matchEntity!: Object;
  triggeredEvents!: TriggeredEvent[];

  constructor(fields?: {
    type: SportType;
    status: MatchStatus;
    tournamentIds: string[];
    matchId: String;
    matchEntity: Object;
    triggeredEvents: TriggeredEvent[];
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
