"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchChallengeRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const matchChallengeSchema_1 = require("./schemas/matchChallengeSchema");
class MatchChallengeRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('MatchChallenge', matchChallengeSchema_1.matchChallengeSchema);
    }
}
exports.MatchChallengeRepository = MatchChallengeRepository;
//# sourceMappingURL=matchChallengeRepository.js.map