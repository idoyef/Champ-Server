import { Schema } from 'mongoose';

export const matchSchema = new Schema({
  type: { type: String },
  status: { type: String },
  tournamentIds: { type: [String] },
  matchId: { type: String },
  matchEntity: { type: Object },
  triggeredEvents: { type: [Object] },
}).set('timestamps', true);
