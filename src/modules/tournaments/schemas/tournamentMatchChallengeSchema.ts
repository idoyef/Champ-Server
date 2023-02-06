import { Schema } from 'mongoose';

export const tournamentMatchChallengeSchema = new Schema(
  {
    matchId: { type: String },
    matchChallengeId: { type: String },
  },
  { _id: false }
);
