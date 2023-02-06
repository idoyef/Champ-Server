export class IntervalDuration {
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  days: number = 0;

  constructor(fields?: {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
