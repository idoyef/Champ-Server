"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSchema = void 0;
const mongoose_1 = require("mongoose");
exports.matchSchema = new mongoose_1.Schema({
    type: { type: String },
    status: { type: String },
    tournamentIds: { type: [String] },
    matchId: { type: String },
    matchEntity: { type: Object },
    triggeredEvents: { type: [Object] },
}).set('timestamps', true);
//# sourceMappingURL=matchSchema.js.map