import { Schema } from 'mongoose';

export const soccerMatchSchema = new Schema({
  matchId: { type: String, required: false },
  leagueId: { type: String, required: false },
  league: { type: Object, required: false },
  eventDate: { type: Date, required: false },
  eventTimestamp: { type: Number, required: false },
  firstHalfStart: { type: Number, required: false },
  secondHalfStart: { type: Number, required: false },
  round: { type: String, required: false },
  status: { type: String, required: false },
  statusShort: { type: String, required: false },
  elapsed: { type: Number, required: false },
  venue: { type: Object, required: false },
  referee: { type: String, required: false },
  homeTeam: { type: Object, required: false },
  awayTeam: { type: Object, required: false },
  goalsHomeTeam: { type: Number, required: false },
  goalsAwayTeam: { type: Number, required: false },
  score: { type: Object, required: false },
  events: { type: [Object], required: false },
}).set('timestamps', true);
