import { SportType } from '../../../common/enums/sportType';

export interface MatchQuery {
  id?: string;
  matchId?: string;
  from?: Date;
  to?: Date;
  status?: string; // change to enum depends on sportType
  type?: SportType;
}
