import { Schema } from 'mongoose';

export const matchSchema = new Schema({
  type: { type: String },
  status: { type: String },
  tournamentIds: { type: [String] },
  matchId: { type: String },
  participantScore: { type: Object },
  challengesResolved: { type: Boolean },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
matchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
matchSchema.set('toJSON', {
  virtuals: true,
});
