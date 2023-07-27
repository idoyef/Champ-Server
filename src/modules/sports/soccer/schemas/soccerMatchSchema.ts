import { Schema } from 'mongoose';

export const soccerMatchSchema = new Schema({
  date: { type: Date, index: true },
  soccerId: { type: String },
  matchId: { type: String },
  fixture: { type: Object, required: false },
  league: { type: Object, required: false },
  teams: { type: Object, required: false },
  goals: { type: Object, required: false },
  score: { type: Object, required: false },
  events: { type: [Object], required: false },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
soccerMatchSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
soccerMatchSchema.set('toJSON', {
  virtuals: true,
});
