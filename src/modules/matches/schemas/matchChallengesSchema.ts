import { Schema } from 'mongoose';

export const matchChallengesSchema = new Schema({
  matchId: { type: String, index: true },
  tournamentId: { type: String, index: true },
  matchType: { type: String },
  challengesIds: { type: [String] },
  status: { type: String },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
matchChallengesSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
matchChallengesSchema.set('toJSON', {
  virtuals: true,
});
