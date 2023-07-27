import { Schema } from 'mongoose';

export const challengeSchema = new Schema({
  type: { type: String },
  resultTriggerType: { type: String },
  participantsGuess: { type: Object },
  challengeParticipantsScore: { type: Object },
  score: { type: Number },
  result: { type: Object },
  status: { type: String },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
challengeSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
challengeSchema.set('toJSON', {
  virtuals: true,
});
