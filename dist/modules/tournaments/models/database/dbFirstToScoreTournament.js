"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFirstToScoreTournamentBase = void 0;
const dbTournamentBase_1 = require("./dbTournamentBase");
class DbFirstToScoreTournamentBase extends dbTournamentBase_1.DbTournamentBase {
    constructor(fields) {
        super();
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.DbFirstToScoreTournamentBase = DbFirstToScoreTournamentBase;
//# sourceMappingURL=dbFirstToScoreTournament.js.map