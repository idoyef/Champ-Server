import { SportType } from '../../../common/enums/sportType';
import { MatchChallengeStatus } from '../enums/MatchChallengeStatus';

export interface MatchChallenges {
  matchId: string;
  tournamentId: string;
  matchType: SportType;
  challengesIds: string[];
  status: MatchChallengeStatus;
}
