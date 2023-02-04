"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler_1 = require("./errorHandler");
const generateToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    return jsonwebtoken_1.sign(payload, jwtSecret);
};
exports.generateToken = generateToken;
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined') {
        throw new errorHandler_1.UnauthorizedException(new errorHandler_1.ErrorReason('Invalid Token', 'Token is invalid'));
    }
    const jwtSecret = process.env.JWT_SECRET;
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    if (!token) {
        throw new errorHandler_1.UnauthorizedException(new errorHandler_1.ErrorReason('Invalid Token', 'Token is invalid'));
    }
    jsonwebtoken_1.verify(token, jwtSecret, (err, payload) => {
        if (err) {
            throw new errorHandler_1.UnauthorizedException(new errorHandler_1.ErrorReason('Invalid Token', 'Token is invalid'));
        }
        req.userInfo = payload;
        next();
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenHandler.js.map