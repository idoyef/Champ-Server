import { Schema } from 'mongoose';

export const tournamentMatchChallengeSchema = new Schema(
  {
    matchId: { type: String },
    matchChallengeId: { type: [String] },
  },
  { _id: false }
);

// Duplicate the ID field.
tournamentMatchChallengeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
tournamentMatchChallengeSchema.set('toJSON', {
  virtuals: true,
});
