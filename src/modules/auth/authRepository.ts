import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { credentialsSchema } from './schemas/credentialsSchema';
import { DbCredentials } from './models/credentials';

export class AuthRepository extends BaseRepository<DbCredentials> {
  constructor() {
    super('Credentials', credentialsSchema);
  }
}
