import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbMatchChallenge } from './models/database/dbMatchChallenge';
import { matchChallengeSchema } from './schemas/matchChallengeSchema';

export class MatchChallengeRepository extends BaseRepository<DbMatchChallenge> {
  constructor() {
    super('MatchChallenge', matchChallengeSchema);
  }
}
