import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbMatchChallenge } from './models/database/dbMatchChallenge';
import { matchChallengesSchema } from './schemas/matchChallengesSchema';

export class MatchChallengesRepository extends BaseRepository<DbMatchChallenge> {
  constructor() {
    super('MatchChallenges', matchChallengesSchema);
  }
}
