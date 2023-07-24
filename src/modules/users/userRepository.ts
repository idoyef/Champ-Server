import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbUser } from './models/db/dbUserBase';
import { usersSchema } from './schemas/usersSchema';

export class UserRepository extends BaseRepository<DbUser> {
  constructor() {
    super('User', usersSchema);
  }
}
