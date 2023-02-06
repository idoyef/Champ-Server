import { Schema } from 'mongoose';

export const metadataSchema = new Schema({
  service: { type: String, required: true },
  lastDateUpdated: { type: String, required: true }
});
