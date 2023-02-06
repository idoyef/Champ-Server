import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbChallenge } from './models/database/dbChallenge';
import { challengeSchema } from './schemas/challengeSchema';

export class ChallengeRepository extends BaseRepository<DbChallenge> {
  constructor() {
    super('Challenge', challengeSchema);
  }
}
