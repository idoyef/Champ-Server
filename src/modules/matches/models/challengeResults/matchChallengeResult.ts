import { MatchChallengeStatus } from '../../../matches/enums/MatchChallengeStatus';
import { MatchChallengeScoreResult } from './matchChallengeScoreResult';

export interface MatchChallengeResult {
  scoreResult: MatchChallengeScoreResult[];
  status: MatchChallengeStatus;
}
