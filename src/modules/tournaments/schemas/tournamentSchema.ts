import { Schema } from 'mongoose';

const tournamentMatch = new Schema({
  matchId: { type: String },
  isResolved: { type: Boolean },
});

export const tournamentSchema = new Schema({
  type: { type: String },
  totalParticipantsScore: { type: Object },
  matches: { type: [tournamentMatch] },
  participantIds: { type: [String] },
  status: { type: String },
  winnerIds: { type: [String] },
  completionScore: { type: Number, default: undefined },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
tournamentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
tournamentSchema.set('toJSON', {
  virtuals: true,
});
