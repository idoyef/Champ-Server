"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const credentials_1 = require("./models/credentials");
const tokenHandler_1 = require("../../utils/tokenHandler");
const mongooseHelper_1 = require("../../common/mongo/mongooseHelper");
const mongooseOperator_1 = require("../../common/mongo/enums/mongooseOperator");
const errorHandler_1 = require("../../utils/errorHandler");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 8;
class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async setUserCredentials(user, password) {
        const encryptedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        const credentials = new credentials_1.Credentials({
            userID: user._id,
            username: user.username,
            email: user.email,
            password: encryptedPassword,
        });
        await this.authRepository.insert(credentials);
        const token = tokenHandler_1.generateToken({
            userId: user._id,
            username: credentials.username,
            email: credentials.email,
        });
        return token;
    }
    async login(loginRequest) {
        const credentialsQuery = mongooseHelper_1.toMongooseQuery({
            username: loginRequest.username,
            email: loginRequest.email,
        }, mongooseOperator_1.MongooseOperator.Or);
        const dbCredentials = await this.authRepository.findOneWithQuery(credentialsQuery);
        if (!dbCredentials) {
            throw new errorHandler_1.UnauthorizedException(new errorHandler_1.ErrorReason('Unauthorized', 'username/password incorrect'));
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(loginRequest.password, dbCredentials.password);
        if (!isPasswordMatch) {
            throw new errorHandler_1.UnauthorizedException(new errorHandler_1.ErrorReason('Unauthorized', 'username/password incorrect'));
        }
        const { _id: id, username, email } = dbCredentials;
        return tokenHandler_1.generateToken({ id, username, email });
    }
    async forgotPassword() { }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map