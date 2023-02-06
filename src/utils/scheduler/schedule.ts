import { ScheduleType } from './scheduleType';
import { Interval } from './interval';
import {
  IsOptional,
  ValidateIf,
  IsDate,
  IsEnum,
  IsDefined,
  IsString,
} from 'class-validator';
import Agenda from 'agenda';

export class Schedule {
  id!: string;

  @IsString()
  @IsDefined()
  consumer!: string;

  @IsEnum(ScheduleType)
  @IsDefined()
  type!: ScheduleType;

  @IsDate()
  start!: Date;

  @ValidateIf((t) => t.type === ScheduleType.DateRangeWithInterval)
  @IsOptional()
  end?: Date;

  @ValidateIf((t) => t.type !== ScheduleType.Once)
  @IsOptional()
  interval?: Interval;

  @IsOptional()
  job!: Agenda.Job;

  @IsOptional()
  jobInfo!: any;

  constructor(fields?: {
    consumer: string;
    type: ScheduleType;
    start: Date;
    end?: Date;
    interval?: Interval;
    job?: Agenda.Job;
    jobInfo?: any;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
