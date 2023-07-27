import { Schema } from 'mongoose';

export const coinSchema = new Schema({
  userId: { type: String },
  coins: { type: Object },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
coinSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
coinSchema.set('toJSON', {
  virtuals: true,
});
