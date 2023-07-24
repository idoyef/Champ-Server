import { EventType } from '../enums/events';
import {
  SoccerFixtureStatusLong,
  SoccerFixtureStatusShort,
} from '../enums/soccerStatus';

export interface SoccerMatch {
  date: Date;
  fixture: SoccerFixture;
  league: SoccerLeague;
  teams: SoccerMatchTeams;
  goals: SoccerMatchGoals;
  score: SoccerMatchScore;
  events: SoccerMatchEvent[];
}

interface SoccerFixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: SoccerFixturePeriods;
  venue: SoccerFixtureVenue;
  status: SoccerFixtureStatus;
}

interface SoccerFixturePeriods {
  first: number | null;
  second: number | null;
}

interface SoccerFixtureVenue {
  id?: number;
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
  winner: boolean | null;
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
  home: number | null;
  away: number | null;
}

interface SoccerMatchEvent {
  time: EventTime;
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: EventType;
  detail?: string;
  comments: string | null;
}

interface EventTime {
  elapsed: number;
  extra: number | null;
}

interface EventTeam {
  id?: number;
  name?: string;
  logo?: string;
}

interface EventPlayer {
  id: number | null;
  name?: string;
}

interface EventAssist {
  id: number | null;
  name: string | null;
}
