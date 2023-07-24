import { SportType } from '../../../../common/enums/sportType';
import { MatchStatus } from '../../enums/matchStatus';

export interface CreateMatchRequest {
  type: SportType;
  status: MatchStatus;
  tournamentIds: string[];
  matchId: string;
  matchEntity?: Object;
}
