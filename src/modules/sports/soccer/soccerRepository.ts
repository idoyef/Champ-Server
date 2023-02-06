import { BaseRepository } from '../../../common/mongo/mongooseWrapperRepository';
import { SoccerMatch } from './models/soccerMatch';
import { soccerMatchSchema } from './schemas/soccerMatchSchema';

export class SoccerRepository extends BaseRepository<SoccerMatch> {
  constructor() {
    super('SoccerMatch', soccerMatchSchema);
  }
}
