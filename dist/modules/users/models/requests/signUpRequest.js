"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpRequest = void 0;
const class_validator_1 = require("class-validator");
const errorHandler_1 = require("../../../../utils/errorHandler");
class SignUpRequest {
    constructor(fields) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
    validate() {
        return errorHandler_1.validateModel(this);
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], SignUpRequest.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail()
], SignUpRequest.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString()
], SignUpRequest.prototype, "password", void 0);
exports.SignUpRequest = SignUpRequest;
//# sourceMappingURL=signUpRequest.js.map