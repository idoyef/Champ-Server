"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoccerRepository = void 0;
const mongooseWrapperRepository_1 = require("../../../common/mongo/mongooseWrapperRepository");
const soccerMatchSchema_1 = require("./schemas/soccerMatchSchema");
class SoccerRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('SoccerMatch', soccerMatchSchema_1.soccerMatchSchema);
    }
}
exports.SoccerRepository = SoccerRepository;
//# sourceMappingURL=soccerRepository.js.map