import { Schema } from 'mongoose';

export const credentialsSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// Duplicate the ID field.
credentialsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
credentialsSchema.set('toJSON', {
  virtuals: true,
});
