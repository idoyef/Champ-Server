import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbMatch } from './models/database/dbMatch';
import { matchSchema } from './schemas/matchSchema';

export class MatchRepository extends BaseRepository<DbMatch> {
  constructor() {
    super('Match', matchSchema);
  }
}
