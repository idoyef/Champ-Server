"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongooseDb {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }
    async connect() {
        if (mongoose_1.default.connection.readyState === 0) {
            this.mongo = await mongoose_1.default.connect(this.connectionString);
        }
    }
    async disconnect() {
        if (this.mongo) {
            await this.mongo.disconnect();
        }
    }
}
exports.MongooseDb = MongooseDb;
//# sourceMappingURL=mongooseDb.js.map