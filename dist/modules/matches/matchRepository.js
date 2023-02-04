"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const matchSchema_1 = require("./schemas/matchSchema");
class MatchRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('Match', matchSchema_1.matchSchema);
    }
}
exports.MatchRepository = MatchRepository;
//# sourceMappingURL=matchRepository.js.map