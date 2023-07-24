import { BaseRepository } from '../../../common/mongo/mongooseWrapperRepository';
import { DbSoccerMatch } from './models/db/dbSoccerMatchBase';
import { soccerMatchSchema } from './schemas/soccerMatchSchema';

export class SoccerMatchRepository extends BaseRepository<DbSoccerMatch> {
  constructor() {
    super('SoccerMatch', soccerMatchSchema);
  }
}
