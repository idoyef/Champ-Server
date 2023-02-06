import { ChallengeType } from './enums/challengeType';
import { WinLossChallengeResult } from './models/challengeResults/winLossChallengeResult';
import { DbChallenge } from './models/database/dbChallenge';
import { TriggeredEvent } from '../../common/models/triggeredEvent';
import { TriggeredEventType } from '../../common/enums/triggeredEventType';
import { SoccerMatchEndDetails } from '../../common/models/triggers/soccer/soccerMatchEndDetails';
import { WinLossResultOptions } from './enums/winLossResultOptions';
import { ParticipantsScore } from '../tournaments/models/participantsScore';
import { plainToClass } from 'class-transformer';

export class SoccerChallengeService {
  constructor() {}

  calculateMatchChallengeScoreResult(
    challenge: DbChallenge,
    event: TriggeredEvent
  ): DbChallenge {
    switch (challenge.type) {
      case ChallengeType.WinLoss:
        if (event.type === TriggeredEventType.SoccerMatchEnd) {
          challenge.challengeParticipantsScore = new ParticipantsScore();
          const homeScore = (event.data as SoccerMatchEndDetails).homeScore;
          const awayScore = (event.data as SoccerMatchEndDetails).awayScore;
          const matchWinner =
            homeScore > awayScore
              ? WinLossResultOptions.Home
              : homeScore < awayScore
              ? WinLossResultOptions.Away
              : WinLossResultOptions.Tie;
          challenge.result = new WinLossChallengeResult({ matchWinner });
          for (const pg in challenge.participantsGuess) {
            if (
              Object.prototype.hasOwnProperty.call(
                challenge.participantsGuess,
                pg
              )
            ) {
              const guess = (challenge.participantsGuess[
                pg
              ] as WinLossChallengeResult).matchWinner;
              challenge.challengeParticipantsScore[pg] =
                matchWinner === guess ? challenge.bet : 0;
            }
          }
        }
        break;
      case ChallengeType.WinLoss:
        break;
      default:
        break;
    }

    return plainToClass(DbChallenge, challenge as DbChallenge);
  }
}
