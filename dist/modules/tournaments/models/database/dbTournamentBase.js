"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTournamentBase = void 0;
class DbTournamentBase {
    constructor(fields) {
        this.version = 0;
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.DbTournamentBase = DbTournamentBase;
//# sourceMappingURL=dbTournamentBase.js.map