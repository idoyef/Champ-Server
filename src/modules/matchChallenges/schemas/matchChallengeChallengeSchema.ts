import { Schema } from 'mongoose';

export const matchChallengeChallengeSchema = new Schema(
  {
    challengeId: { type: String, index: { unique: true } },
    challengeType: { type: String },
    resultTriggerType: { type: String },
  },
  { _id: false }
);
