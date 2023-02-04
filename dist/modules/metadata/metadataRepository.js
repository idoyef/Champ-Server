"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const metadataSchema_1 = require("./schemas/metadataSchema");
class MetadataRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('Metadata', metadataSchema_1.metadataSchema);
    }
}
exports.MetadataRepository = MetadataRepository;
//# sourceMappingURL=metadataRepository.js.map