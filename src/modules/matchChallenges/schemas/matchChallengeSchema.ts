import { Schema } from 'mongoose';
import { matchChallengeChallengeSchema } from './matchChallengeChallengeSchema';

export const matchChallengeSchema = new Schema({
  matchId: { type: String, index: { unique: true } },
  matchType: { type: String },
  challenges: { type: [matchChallengeChallengeSchema] },
  status: { type: String },
  matchParticipantsScore: { type: Object },
}).set('timestamps', true);
