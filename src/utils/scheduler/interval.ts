import { IntervalDuration } from './intervalDuration';

export class Interval {
  every!: string;
  duration!: IntervalDuration;
  repetition: number = 0;

  constructor(fields?: {
    every?: string;
    duration?: IntervalDuration;
    repetition?: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
