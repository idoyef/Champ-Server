import { SoccerMatchStatus } from '../enums/soccerMatchStatus';
import { SoccerTeam } from './soccerTeam';

export class SoccerMatch {
  createdAt!: Date;
  updatedAt!: Date;

  _id!: string;
  matchId!: string;
  leagueId!: string;
  league!: any;
  eventDate!: Date;
  eventTimestamp!: Number;
  firstHalfStart?: any;
  secondHalfStart?: any;
  round!: string;
  status!: any;
  elapsed!: any;
  venue!: any;
  referee!: string;
  homeTeam!: SoccerTeam;
  awayTeam!: SoccerTeam;
  goalsHomeTeam!: number;
  goalsAwayTeam!: number;
  score!: any;
  events!: any[];

  constructor(fields?: {
    matchId: string;
    leagueId: string;
    league: any;
    eventDate: Date;
    eventTimestamp: Number;
    firstHalfStart?: any;
    secondHalfStart?: any;
    round: string;
    status: SoccerMatchStatus;
    elapsed: any;
    venue: any;
    referee: string;
    homeTeam: SoccerTeam;
    awayTeam: SoccerTeam;
    goalsHomeTeam: number;
    goalsAwayTeam: number;
    score: any;
    events: any[];
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
