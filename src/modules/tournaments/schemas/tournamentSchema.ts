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
  winnersIds: { type: [String] },
  completionScore: { type: Number, default: undefined },
  bet: { type: Number },
  sharedPot: { type: Number },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
tournamentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
tournamentSchema.set('toJSON', {
  virtuals: true,
});
