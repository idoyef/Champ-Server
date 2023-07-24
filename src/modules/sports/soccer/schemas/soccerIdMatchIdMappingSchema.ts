import { Schema } from 'mongoose';

export const soccerIdMatchIdMappingSchema = new Schema({
  soccerId: { type: Number, index: true },
  id: { type: String },
})
  .set('timestamps', true)
  .set('toObject', { virtuals: true });

// // Duplicate the ID field.
// soccerIdMatchIdMappingSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// Ensure virtual fields are serialised.
soccerIdMatchIdMappingSchema.set('toJSON', {
  virtuals: true,
});
