"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentMatchChallengeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tournamentMatchChallengeSchema = new mongoose_1.Schema({
    matchId: { type: String },
    matchChallengeId: { type: String },
}, { _id: false });
//# sourceMappingURL=tournamentMatchChallengeSchema.js.map