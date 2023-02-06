import { Schema } from 'mongoose';

export const usersSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  state: { type: String, required: true },
}).set('timestamps', true);
