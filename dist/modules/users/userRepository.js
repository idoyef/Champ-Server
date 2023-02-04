"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mongooseWrapperRepository_1 = require("../../common/mongo/mongooseWrapperRepository");
const usersSchema_1 = require("./schemas/usersSchema");
class UserRepository extends mongooseWrapperRepository_1.BaseRepository {
    constructor() {
        super('User', usersSchema_1.usersSchema);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map