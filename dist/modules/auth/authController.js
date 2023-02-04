"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = __importDefault(require("express"));
const class_transformer_1 = require("class-transformer");
const loginRequest_1 = require("./models/loginRequest");
const router = express_1.default.Router();
const authController = (authService) => {
    router.route('/login').post(login);
    router.route('/forgotPassword').post(forgotPassword);
    async function login(req, res, next) {
        try {
            const loginRequest = class_transformer_1.plainToClass(loginRequest_1.LoginRequest, req.body);
            const result = await authService.login(loginRequest);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function forgotPassword(req, res, next) {
        try {
            const result = await authService.forgotPassword();
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    return router;
};
exports.authController = authController;
//# sourceMappingURL=authController.js.map