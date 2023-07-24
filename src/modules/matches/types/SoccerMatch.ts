import { EventType } from '../enums/events';
import {
  SoccerFixtureStatusLong,
  SoccerFixtureStatusShort,
} from '../enums/soccerStatus';

export interface SoccerMatch {
  fixture: SoccerFixture;
  league: SoccerLeague;
  teams: SoccerMatchTeams;
  goals: SoccerMatchGoals;
  score: SoccerMatchScore;
  events: SoccerMatchEvent[];
}

interface SoccerFixture {
  id: number;
  referee?: string;
  timezone: string;
  date: Date;
  timstamp: string;
  periods: SoccerFixturePeriods;
  venue: SoccerFixtureVenue;
  status: SoccerFixtureStatus;
}

interface SoccerFixturePeriods {
  first: string;
  second: string;
}

interface SoccerFixtureVenue {
  id?: string;
  name?: string;
  city?: string;
}

interface SoccerFixtureStatus {
  long: SoccerFixtureStatusLong;
  short: SoccerFixtureStatusShort;
  elapsed: number;
}

interface SoccerLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}

interface SoccerMatchTeams {
  home: SoccerMatchTeam;
  away: SoccerMatchTeam;
}

interface SoccerMatchTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

interface SoccerMatchGoals {
  home: number;
  away: number;
}

interface SoccerMatchScore {
  halftime: MatchScore;
  fulltime: MatchScore;
  extratime: MatchScore;
  penalty: MatchScore;
}

interface MatchScore {
  home?: number;
  away?: number;
}

interface SoccerMatchEvent {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: EventType;
  detail?: string;
  comments?: string;
}

interface EventTime {
  elapsed: number;
  extra?: number;
}

interface EventTeam {
  id?: number;
  name?: string;
  logo?: string;
}

interface EventPlayer {
  id?: number;
  name?: string;
}

interface EventAssist {
  id?: number;
  name?: string;
}
