import Agenda from 'agenda';
import { generalConfig, schedulerConfig } from '../../configuration';
import { Schedule } from './schedule';
import { IScheduler } from './IScheduler';
import { ScheduleType } from './scheduleType';
import { plainToClass } from 'class-transformer';
import { IntervalDuration } from './intervalDuration';
import { ScheduleQuery } from './scheduleQuery';

const defaultJobName = 'job';
const options = { priority: schedulerConfig.priority, concurrency: 20 };

export class AgendaWrapper implements IScheduler {
  agenda!: Agenda;
  consumerCallbacks: any = {};

  constructor() {
    this.agenda = new Agenda({
      db: { address: generalConfig.dbUrl, collection: 'agendaJobs' },
    });
    this.agenda.processEvery(schedulerConfig.processEvery);

    (async () => {
      await this.agenda.start();
    })();
  }

  register(
    consumer: string,
    jobNames: string[],
    callback: (job: Agenda.Job) => void
  ) {
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

  async addSchedule(schedule: Schedule): Promise<any> {
    // validate schedule
    await this.agenda.schedule(
      schedule.start,
      schedule.jobInfo?.jobName ?? defaultJobName,
      schedule
    );
  }

  async getScheduleWithQuery(query: ScheduleQuery) {
    return await this.agenda.jobs({ name: query.jobName });
  }

  async cancelSchedule(job: Agenda.Job) {
    await job.remove();
  }

  async executeJob(job: Agenda.Job) {
    const scheduleData = plainToClass(Schedule, job.attrs.data);

    switch (scheduleData.type) {
      case ScheduleType.Once:
        await this.consumerCallbacks[scheduleData.consumer](job);
        break;
      case ScheduleType.Interval:
        await this.consumerCallbacks[scheduleData.consumer](job);

        this.agenda.define(
          scheduleData.jobInfo.jobName + 'Every',
          options,
          this.consumerCallbacks[scheduleData.consumer].bind(this, job)
        );

        this.agenda.every(
          scheduleData.interval?.every ?? '5 minutes',
          scheduleData.jobInfo.jobName + 'Every',
          scheduleData
        );
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

  private addIntervalDuration(start: Date, duration?: IntervalDuration) {
    if (!duration) return;

    let result: Date = start;

    if (duration.days) {
      result.setDate(result.getDate() + duration.days);
    }

    result.setTime(
      result.getTime() +
        duration.hours * 60 * 60 * 1000 +
        duration.minutes * 60 * 1000 +
        duration.seconds * 1000
    );

    return result;
  }
}
