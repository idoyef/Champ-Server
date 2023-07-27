import { Schema } from 'mongoose';

export const matchTournamentsRelationsSchema = new Schema({
  matchId: { type: String },
  tournamentIds: { type: [Object] },
});

// Duplicate the ID field.
matchTournamentsRelationsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
matchTournamentsRelationsSchema.set('toJSON', {
  virtuals: true,
});
