"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchChallengeChallengeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.matchChallengeChallengeSchema = new mongoose_1.Schema({
    challengeId: { type: String, index: { unique: true } },
    challengeType: { type: String },
    resultTriggerType: { type: String },
}, { _id: false });
//# sourceMappingURL=matchChallengeChallengeSchema.js.map