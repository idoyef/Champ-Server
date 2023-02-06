import { Schema } from 'mongoose';

export const matchTournamentsRelationsSchema = new Schema({
  matchId: { type: String },
  tournamentIds: { type: [Object] },
});
