"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataService = void 0;
class MetadataService {
    constructor(metadataRepository) {
        this.metadataRepository = metadataRepository;
    }
    async addMetadata(metadata) {
        return await this.metadataRepository.insert(metadata);
    }
    async getMetadataById(id) {
        return await this.metadataRepository.findById(id);
    }
    async getMetadataWithQuery(query) {
        return await this.metadataRepository.findManyWithQuery(query);
    }
    async updateMetadataById(metadata) {
        return await this.metadataRepository.updateWithSetById(metadata.id, metadata);
    }
}
exports.MetadataService = MetadataService;
//# sourceMappingURL=metadataService.js.map