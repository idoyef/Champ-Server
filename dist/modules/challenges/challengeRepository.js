"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const challengeSchema_1 = require("./schemas/challengeSchema");
class ChallengeRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('Challenge', challengeSchema_1.challengeSchema);
    }
}
exports.ChallengeRepository = ChallengeRepository;
//# sourceMappingURL=challengeRepository.js.map