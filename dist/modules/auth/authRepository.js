"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const credentialsSchema_1 = require("./schemas/credentialsSchema");
class AuthRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('Credentials', credentialsSchema_1.credentialsSchema);
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=authRepository.js.map