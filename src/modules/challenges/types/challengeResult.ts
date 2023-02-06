import { ExactScoreChallengeResult } from '../models/challengeResults/exactScoreChallengeResult';
import { WinLossChallengeResult } from '../models/challengeResults/winLossChallengeResult';

export type ChallengeResult =
  | WinLossChallengeResult
  | ExactScoreChallengeResult;
