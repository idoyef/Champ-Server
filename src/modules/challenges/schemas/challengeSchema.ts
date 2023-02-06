import { Schema } from 'mongoose';

export const challengeSchema = new Schema({
  type: { type: String },
  resultTriggerType: { type: String },
  participantsGuess: { type: Object },
  challengeParticipantsScore: { type: Object },
  bet: { type: Number },
  result: { type: Object },
  status: { type: String },
}).set('timestamps', true);
