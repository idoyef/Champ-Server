"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalDuration = void 0;
class IntervalDuration {
    constructor(fields) {
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.days = 0;
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
exports.IntervalDuration = IntervalDuration;
//# sourceMappingURL=intervalDuration.js.map