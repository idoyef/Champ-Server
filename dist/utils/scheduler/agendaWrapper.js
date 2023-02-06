"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaWrapper = void 0;
const agenda_1 = __importDefault(require("agenda"));
const configuration_1 = require("../../configuration");
const schedule_1 = require("./schedule");
const scheduleType_1 = require("./scheduleType");
const class_transformer_1 = require("class-transformer");
const defaultJobName = 'job';
const options = { priority: configuration_1.schedulerConfig.priority, concurrency: 20 };
class AgendaWrapper {
    constructor() {
        this.consumerCallbacks = {};
        this.agenda = new agenda_1.default({
            db: { address: configuration_1.generalConfig.dbUrl, collection: 'agendaJobs' },
        });
        this.agenda.processEvery(configuration_1.schedulerConfig.processEvery);
        (async () => {
            await this.agenda.start();
        })();
    }
    register(consumer, jobNames, callback) {
        this.consumerCallbacks[consumer] = callback;
        for (const jobName of jobNames) {
            this.agenda.define(jobName, options, this.executeJob.bind(this));
        }
    }
    async start() {
        await this.agenda.start();
    }
    stop() {
        (async () => {
            await this.agenda.stop();
            process.exit(0);
        })();
    }
    async addSchedule(schedule) {
        var _a, _b;
        // validate schedule
        await this.agenda.schedule(schedule.start, (_b = (_a = schedule.jobInfo) === null || _a === void 0 ? void 0 : _a.jobName) !== null && _b !== void 0 ? _b : defaultJobName, schedule);
    }
    async getScheduleWithQuery(query) {
        return await this.agenda.jobs({ name: query.jobName });
    }
    async cancelSchedule(job) {
        await job.remove();
    }
    async executeJob(job) {
        var _a, _b;
        const scheduleData = (0, class_transformer_1.plainToClass)(schedule_1.Schedule, job.attrs.data);
        switch (scheduleData.type) {
            case scheduleType_1.ScheduleType.Once:
                await this.consumerCallbacks[scheduleData.consumer](job);
                break;
            case scheduleType_1.ScheduleType.Interval:
                await this.consumerCallbacks[scheduleData.consumer](job);
                this.agenda.define(scheduleData.jobInfo.jobName + 'Every', options, this.consumerCallbacks[scheduleData.consumer].bind(this, job));
                this.agenda.every((_b = (_a = scheduleData.interval) === null || _a === void 0 ? void 0 : _a.every) !== null && _b !== void 0 ? _b : '5 minutes', scheduleData.jobInfo.jobName + 'Every', scheduleData);
                break;
            // case ScheduleType.DateRangeWithInterval:
            //   if (
            //     nextIntervalDate &&
            //     scheduleData.end &&
            //     scheduleData.end.getTime > nextIntervalDate.getTime
            //   ) {
            //     this.addSchedule(
            //       Object.assign({ ...scheduleData, start: nextIntervalDate })
            //     );
            //   }
            //   break;
            // case ScheduleType.FixedRepetition:
            //   scheduleData.interval.repetition--;
            //   if (scheduleData.interval.repetition > 0 && nextIntervalDate) {
            //     this.addSchedule(
            //       Object.assign({ ...scheduleData, start: nextIntervalDate })
            //     );
            //   }
            //   break;
        }
        // await job.remove();
    }
    addIntervalDuration(start, duration) {
        if (!duration)
            return;
        let result = start;
        if (duration.days) {
            result.setDate(result.getDate() + duration.days);
        }
        result.setTime(result.getTime() +
            duration.hours * 60 * 60 * 1000 +
            duration.minutes * 60 * 1000 +
            duration.seconds * 1000);
        return result;
    }
}
exports.AgendaWrapper = AgendaWrapper;
//# sourceMappingURL=agendaWrapper.js.map