import { Schema } from 'mongoose';
import { tournamentMatchChallengeSchema } from './tournamentMatchChallengeSchema';

export const tournamentSchema = new Schema({
  type: { type: String },
  totalParticipantsScore: { type: Object },
  matchChallenges: { type: [tournamentMatchChallengeSchema] },
  participantIds: { type: [String] },
  status: { type: String },
  winnerId: { type: String },
  completionScore: { type: Number, default: undefined },
}).set('timestamps', true);
