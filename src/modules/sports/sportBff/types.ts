import { SportType } from '../../../common/enums/sportType';

export interface GetMatchesQuery {
  id?: string;
  type?: SportType;
  date?: Date;
}
