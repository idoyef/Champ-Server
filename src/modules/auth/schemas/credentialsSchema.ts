import { Schema } from 'mongoose';

export const credentialsSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})