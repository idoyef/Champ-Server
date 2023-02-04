"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMatchChallenge = void 0;
class DbMatchChallenge {
    constructor(fields) {
        this.matchParticipantsScore = {};
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.DbMatchChallenge = DbMatchChallenge;
//# sourceMappingURL=dbMatchChallenge.js.map