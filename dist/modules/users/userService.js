"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const dbUser_1 = require("./models/dbUser");
const role_1 = require("../../common/enums/role");
const errorHandler_1 = require("../../utils/errorHandler");
const createUserRequest_1 = require("./models/requests/createUserRequest");
const userQuery_1 = require("./models/userQuery");
const userState_1 = require("./enums/userState");
const sectionName = 'UserService';
class UserService {
    constructor(authService, userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }
    async signUp(signUpRequest) {
        await this.validateUserUniqueness(signUpRequest);
        const user = await this.createUser(new createUserRequest_1.CreateUserRequest(signUpRequest));
        const token = await this.authService.setUserCredentials(user, signUpRequest.password);
        const activeUser = await this.userRepository.updateWithSetById(user._id, {
            state: userState_1.UserState.Active,
        });
        return { token, user: activeUser };
    }
    async isUsernameExists(username) {
        if (username === '') {
            return true;
        }
        const user = await this.userRepository.findOneWithQuery(new userQuery_1.UserQuery({ username }));
        return !!user;
    }
    async isEmailExists(email) {
        if (email === '') {
            return true;
        }
        const user = await this.userRepository.findOneWithQuery(new userQuery_1.UserQuery({ email }));
        return !!user;
    }
    async createUser(user) {
        (0, errorHandler_1.validate)(user, sectionName);
        const userToSave = this.populateUserToSave(user);
        return await this.userRepository.insert(userToSave);
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async getUserWithQuery(query) {
        (0, errorHandler_1.validate)(query, sectionName);
        return this.userRepository.findManyWithQuery(query);
    }
    async validateUserUniqueness(signUpRequest) {
        if (await this.isUsernameExists(signUpRequest.username)) {
            throw new errorHandler_1.EntityConflictException(sectionName, ['username'], new errorHandler_1.ErrorReason('username', 'Username is already exists'));
        }
        if (await this.isEmailExists(signUpRequest.email)) {
            throw new errorHandler_1.EntityConflictException(sectionName, ['email'], new errorHandler_1.ErrorReason('email', 'Email is already exists'));
        }
    }
    populateUserToSave(user) {
        return new dbUser_1.DbUser({
            username: user.username,
            email: user.email,
            role: role_1.Role.User,
            state: userState_1.UserState.PreActive,
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map