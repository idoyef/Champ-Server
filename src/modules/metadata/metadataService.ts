import { MetadataQuery } from './models/metadataQuery';
import { Metadata } from './models/metadata';
import { MetadataRepository } from './metadataRepository';

export class MetadataService {
  constructor(private metadataRepository: MetadataRepository) {}

  async addMetadata(metadata: Metadata) {
    return await this.metadataRepository.insert(metadata);
  }

  async getMetadataById(id: string) {
    return await this.metadataRepository.findById(id);
  }

  async getMetadataWithQuery(query: MetadataQuery) {
    return await this.metadataRepository.findManyWithQuery(query);
  }

  async updateMetadataById(metadata: Metadata) {
    return await this.metadataRepository.updateWithSetById(
      metadata.id,
      metadata
    );
  }
}
