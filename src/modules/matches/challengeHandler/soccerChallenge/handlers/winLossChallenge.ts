import { SoccerMatchTrigger } from '../../../../../common/enums/matchTrigger';
import { ChallengeStatus } from '../../../enums/ChallengeStatus';
import { MatchStatus } from '../../../enums/matchStatus';
import { WinLossChallengeResult } from '../../../models/challengeResults/winLossChallengeResult';
import { DbChallenge } from '../../../models/database/dbChallenge';

export const winLossHandler = (
  matchStatus: MatchStatus,
  challenge: DbChallenge,
  triggerType: SoccerMatchTrigger,
  payload: any
): { challengeParticipantsScore: any; challengeStatus: ChallengeStatus } => {
  switch (triggerType) {
    case SoccerMatchTrigger.UPDATE_SCORE:
      return calculateChallenge(matchStatus, challenge, payload);
  }

  if (matchStatus === MatchStatus.Finished) {
    return calculateChallenge(matchStatus, challenge, payload);
  }

  const { challengeParticipantsScore, status } = challenge;
  return { challengeParticipantsScore, challengeStatus: status };
};

const calculateChallenge = (
  matchStatus: MatchStatus,
  challenge: DbChallenge,
  payload: any
): { challengeParticipantsScore: any; challengeStatus: ChallengeStatus } => {
  let challengeParticipantsScore: any = {};
  let challengeStatus: ChallengeStatus = ChallengeStatus.NotStarted;

  const { participantsGuess, score } = challenge;
  const result =
    payload.home === payload.away
      ? 'Tie'
      : payload.home > payload.away
      ? 'Home'
      : 'Away';

  for (const id in participantsGuess) {
    const guess = participantsGuess[id] as WinLossChallengeResult;

    challengeParticipantsScore[id] = guess.matchWinner === result ? score : 0;
    challengeStatus =
      matchStatus === MatchStatus.Finished
        ? ChallengeStatus.Finished
        : ChallengeStatus.Started;
  }

  return { challengeParticipantsScore, challengeStatus };
};
