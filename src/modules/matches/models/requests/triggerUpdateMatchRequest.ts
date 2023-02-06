import { TriggeredEvent } from "../../../../common/models/triggeredEvent";

export class TriggerUpdateMatchRequest {
  matchId!: string;
  match!: object;
  triggeredEvents!: TriggeredEvent[];

  constructor(fields?: {
    matchId: string;
    match: object;
    triggeredEvents: TriggeredEvent[];
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
