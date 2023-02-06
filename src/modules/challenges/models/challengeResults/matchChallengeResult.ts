import { MatchChallengeScoreResult } from './MatchChallengeScoreResult';
import { MatchChallengeStatus } from '../../../matchChallenges/enums/matchChallengeStatus';

export class MatchChallengeResult {
  scoreResult!: MatchChallengeScoreResult[];
  status!: MatchChallengeStatus;

  constructor(fields?: { scoreResult: MatchChallengeScoreResult[]; status: MatchChallengeStatus }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
