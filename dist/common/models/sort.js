"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sort = void 0;
const sortOrder_1 = require("../enums/sortOrder");
class Sort {
    constructor(fields) {
        if (fields) {
            this.fieldName = fields.fieldName;
            this.sortOrder =
                +fields.sortOrder === 1 || fields.sortOrder === 'Asc'
                    ? sortOrder_1.SortOrder.Asc
                    : sortOrder_1.SortOrder.Desc;
        }
    }
}
exports.Sort = Sort;
//# sourceMappingURL=sort.js.map