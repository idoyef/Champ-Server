import { TriggeredEvent } from './triggeredEvent';

export class MatchTriggeredEvent {
  matchId!: string;
  tournamentIds!: string[];
  events!: TriggeredEvent[];

  constructor(fields?: { matchId: string; tournamentIds: string[]; events: TriggeredEvent[] }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
