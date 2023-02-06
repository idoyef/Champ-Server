"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const mongooseDb_1 = require("./common/mongo/mongooseDb");
const configuration_1 = require("./configuration");
dotenv_1.default.config();
const dbUrl = configuration_1.generalConfig.dbUrl;
const connectDB = async () => {
    new mongooseDb_1.MongooseDb(dbUrl).connect();
};
const disconnectDB = async () => {
    new mongooseDb_1.MongooseDb(dbUrl).disconnect();
};
connectDB();
const app = (0, app_1.initApp)();
const server = app.listen(5000, () => {
    console.log('Server is listening on port: 5000');
});
const closeServer = async () => {
    await disconnectDB();
    await server.close();
};
process.on('SIGINT', () => closeServer());
process.on('SIGTERM', () => closeServer());
//# sourceMappingURL=server.js.map