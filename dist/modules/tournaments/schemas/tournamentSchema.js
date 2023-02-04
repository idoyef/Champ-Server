"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentSchema = void 0;
const mongoose_1 = require("mongoose");
const tournamentMatchChallengeSchema_1 = require("./tournamentMatchChallengeSchema");
exports.tournamentSchema = new mongoose_1.Schema({
    type: { type: String },
    totalParticipantsScore: { type: Object },
    matchChallenges: { type: [tournamentMatchChallengeSchema_1.tournamentMatchChallengeSchema] },
    participantIds: { type: [String] },
    status: { type: String },
    winnerId: { type: String },
    completionScore: { type: Number, default: undefined },
}).set('timestamps', true);
//# sourceMappingURL=tournamentSchema.js.map