"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paging = void 0;
const configuration_1 = require("../../configuration");
class Paging {
    constructor(fields) {
        this.page =
            fields && fields.page ? +fields.page : configuration_1.generalConfig.defaultPageNumber;
        this.pageSize =
            fields && fields.pageSize
                ? +fields.pageSize
                : configuration_1.generalConfig.defaultPageSize;
    }
}
exports.Paging = Paging;
//# sourceMappingURL=paging.js.map