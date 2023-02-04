"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchTournamentsRelationsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.matchTournamentsRelationsSchema = new mongoose_1.Schema({
    matchId: { type: String },
    tournamentIds: { type: [Object] },
});
//# sourceMappingURL=matchTournamentsRelationsSchema.js.map