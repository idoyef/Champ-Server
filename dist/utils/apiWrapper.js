"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiWrapper = void 0;
const axios_1 = __importDefault(require("axios"));
class ApiWrapper {
    async get(url, headers) {
        return axios_1.default.get(url, { headers }).catch(error => {
            throw error;
        });
    }
    async post(url, data, headers) {
        return axios_1.default.post(url, data, { headers }).catch(error => {
            throw error;
        });
    }
}
exports.ApiWrapper = ApiWrapper;
//# sourceMappingURL=apiWrapper.js.map