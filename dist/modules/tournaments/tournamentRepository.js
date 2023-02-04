"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const tournamentSchema_1 = require("./schemas/tournamentSchema");
class TournamentRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('Tournament', tournamentSchema_1.tournamentSchema);
    }
}
exports.TournamentRepository = TournamentRepository;
//# sourceMappingURL=tournamentRepository.js.map