import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { Metadata } from './models/metadata';
import { metadataSchema } from './schemas/metadataSchema';

export class MetadataRepository extends BaseRepository<Metadata> {
  constructor() {
    super('Metadata', metadataSchema);
  }
}
