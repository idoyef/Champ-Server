"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataSchema = void 0;
const mongoose_1 = require("mongoose");
exports.metadataSchema = new mongoose_1.Schema({
    service: { type: String, required: true },
    lastDateUpdated: { type: String, required: true }
});
//# sourceMappingURL=metadataSchema.js.map