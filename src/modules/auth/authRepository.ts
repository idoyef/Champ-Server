import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { credentialsSchema } from './schemas/credentialsSchema';
import { Credentials } from './models/credentials';

export class AuthRepository extends BaseRepository<Credentials> {
  constructor() {
    super('Credentials', credentialsSchema);
  }
}
