"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = void 0;
const mongoose_1 = require("mongoose");
exports.usersSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    state: { type: String, required: true },
}).set('timestamps', true);
//# sourceMappingURL=usersSchema.js.map