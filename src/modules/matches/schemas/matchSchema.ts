import { Schema } from 'mongoose';

export const matchSchema = new Schema({
  type: { type: String },
  status: { type: String },
  tournamentIds: { type: [String] },
  matchId: { type: String },
  challengesResolved: { type: Boolean },
  // matchEntity: { type: Object },
  // triggeredEvents: { type: [Object] },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
matchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
matchSchema.set('toJSON', {
  virtuals: true,
});
