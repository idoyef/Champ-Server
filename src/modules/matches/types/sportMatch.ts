import { SportType } from '../../../common/enums/sportType';
import { MatchStatus } from '../enums/matchStatus';
// import { SoccerMatch } from './SoccerMatch';

// export type Match = SoccerMatch;

export interface Match {
  type: SportType;
  status: MatchStatus;
  tournamentIds: string[];
  matchId: string;
  challengesResolved: boolean;
  // matchEntity: Object;
  // triggeredEvents: TriggeredEvent[];
}
