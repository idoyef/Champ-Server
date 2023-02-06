import { TriggeredEventType } from '../enums/triggeredEventType';
import { TriggeredEventDetails } from './triggers/types/triggeredEventDetails';

export class TriggeredEvent {
  type!: TriggeredEventType;
  data!: TriggeredEventDetails;

  constructor(fields?: { type: TriggeredEventType; data: TriggeredEventDetails }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
