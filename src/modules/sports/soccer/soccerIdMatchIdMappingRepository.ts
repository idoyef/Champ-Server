import { BaseRepository } from '../../../common/mongo/mongooseWrapperRepository';
import { DbSoccerIdMatchIdMapping } from './models/db/dbSoccerIdMatchIdMapping';
import { soccerIdMatchIdMappingSchema } from './schemas/soccerIdMatchIdMappingSchema';

export class SoccerIdMatchIdMappingRepository extends BaseRepository<DbSoccerIdMatchIdMapping> {
  constructor() {
    super('SoccerIdMatchIdMapping', soccerIdMatchIdMappingSchema);
  }
}
