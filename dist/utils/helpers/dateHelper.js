"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = void 0;
function addDays(date, daysToAdd) {
    return new Date(date.setDate(date.getDate() + daysToAdd));
}
exports.addDays = addDays;
//# sourceMappingURL=dateHelper.js.map