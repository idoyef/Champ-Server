import { Schedule } from './schedule';
import { ScheduleQuery } from './scheduleQuery';

export interface IScheduler {
  register(
    consumer: string,
    jobNames: string[],
    callback: (job: any) => void
  ): void;
  start(): any;
  stop(): any;
  addSchedule(schedule: Schedule): Promise<any>;
  getScheduleWithQuery(query: ScheduleQuery): Promise<any>;
  cancelSchedule(jobInfo: any): Promise<void>;
  executeJob(jobInfo: any, error: any): Promise<void>;
}
