"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchChallengeSchema = void 0;
const mongoose_1 = require("mongoose");
const matchChallengeChallengeSchema_1 = require("./matchChallengeChallengeSchema");
exports.matchChallengeSchema = new mongoose_1.Schema({
    matchId: { type: String, index: { unique: true } },
    matchType: { type: String },
    challenges: { type: [matchChallengeChallengeSchema_1.matchChallengeChallengeSchema] },
    status: { type: String },
    matchParticipantsScore: { type: Object },
}).set('timestamps', true);
//# sourceMappingURL=matchChallengeSchema.js.map