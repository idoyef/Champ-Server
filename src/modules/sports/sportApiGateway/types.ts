import { SportType } from '../../../common/enums/sportType';

export interface FindMatchesBySportQuery {
  sportType: SportType;
  from: Date;
  to: Date;
}
