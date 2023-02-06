import { SportType } from '../../../../common/enums/sportType';
import { MatchStatus } from '../../enums/matchStatus';

export class CreateMatchRequest {
  type!: SportType;
  status!: MatchStatus;
  tournamentIds!: string[];
  matchId!: String;
  matchEntity!: Object;

  constructor(fields?: {
    type: SportType;
    status: MatchStatus;
    matchId: String;
    matchEntity: Object;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
