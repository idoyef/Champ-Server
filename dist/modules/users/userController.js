"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const express_1 = __importDefault(require("express"));
const class_transformer_1 = require("class-transformer");
const userQuery_1 = require("./models/userQuery");
const signUpRequest_1 = require("../auth/models/signUpRequest");
const router = express_1.default.Router();
const userController = (usersService) => {
    router.route('/signup').post(signUp);
    router.route('/isUsernameExists/:username').get(isUsernameExists);
    router.route('/isEmailExists/:email').get(isEmailExists);
    router.route('/').get(getUser);
    router.route('/:id').get(getUser);
    async function signUp(req, res, next) {
        try {
            const signUpRequest = (0, class_transformer_1.plainToClass)(signUpRequest_1.SignUpRequest, req.body);
            const result = await usersService.signUp(signUpRequest);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function isUsernameExists(req, res, next) {
        try {
            const result = await usersService.isUsernameExists(req.params.username);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function isEmailExists(req, res, next) {
        try {
            const result = await usersService.isEmailExists(req.params.email);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function getUser(req, res, next) {
        try {
            let result = {};
            if (req.params.id) {
                result = await usersService.getUserById(req.params.id);
            }
            else {
                (0, class_transformer_1.plainToClass)(userQuery_1.UserQuery, req.params);
                result = await usersService.getUserWithQuery((0, class_transformer_1.plainToClass)(userQuery_1.UserQuery, req.params));
            }
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    return router;
};
exports.userController = userController;
//# sourceMappingURL=userController.js.map