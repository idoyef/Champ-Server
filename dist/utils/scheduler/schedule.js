"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const scheduleType_1 = require("./scheduleType");
const class_validator_1 = require("class-validator");
class Schedule {
    constructor(fields) {
        if (fields) {
            Object.assign(this, fields);
        }
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)()
], Schedule.prototype, "consumer", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(scheduleType_1.ScheduleType),
    (0, class_validator_1.IsDefined)()
], Schedule.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsDate)()
], Schedule.prototype, "start", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((t) => t.type === scheduleType_1.ScheduleType.DateRangeWithInterval),
    (0, class_validator_1.IsOptional)()
], Schedule.prototype, "end", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((t) => t.type !== scheduleType_1.ScheduleType.Once),
    (0, class_validator_1.IsOptional)()
], Schedule.prototype, "interval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], Schedule.prototype, "job", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], Schedule.prototype, "jobInfo", void 0);
exports.Schedule = Schedule;
//# sourceMappingURL=schedule.js.map