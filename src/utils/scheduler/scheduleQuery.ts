export class ScheduleQuery {
  id!: string;
  jobName!: string;

  constructor(fields?: { id?: string; jobName?: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
