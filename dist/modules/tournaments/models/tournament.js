"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tournament = void 0;
class Tournament {
    constructor(fields) {
        this.version = 0;
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.Tournament = Tournament;
//# sourceMappingURL=tournament.js.map