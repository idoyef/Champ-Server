"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.challengeSchema = new mongoose_1.Schema({
    type: { type: String },
    resultTriggerType: { type: String },
    participantsGuess: { type: Object },
    challengeParticipantsScore: { type: Object },
    bet: { type: Number },
    result: { type: Object },
    status: { type: String },
}).set('timestamps', true);
//# sourceMappingURL=challengeSchema.js.map