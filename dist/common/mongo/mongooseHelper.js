"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMongooseQuery = void 0;
const toMongooseQuery = (query, operator) => {
    let params = [];
    for (var key of Object.keys(query)) {
        var param = {};
        param[key] = query[key];
        params.push(param);
    }
    return { [operator]: params };
};
exports.toMongooseQuery = toMongooseQuery;
//# sourceMappingURL=mongooseHelper.js.map