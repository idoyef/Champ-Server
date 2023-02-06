"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserRequest = void 0;
const class_validator_1 = require("class-validator");
const errorHandler_1 = require("../../../../utils/errorHandler");
class CreateUserRequest {
    constructor(fields) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
    validate() {
        return (0, errorHandler_1.validateModel)(this);
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], CreateUserRequest.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)()
], CreateUserRequest.prototype, "email", void 0);
exports.CreateUserRequest = CreateUserRequest;
//# sourceMappingURL=createUserRequest.js.map