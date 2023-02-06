"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoccerChallengeService = void 0;
const challengeType_1 = require("./enums/challengeType");
const winLossChallengeResult_1 = require("./models/challengeResults/winLossChallengeResult");
const dbChallenge_1 = require("./models/database/dbChallenge");
const triggeredEventType_1 = require("../../common/enums/triggeredEventType");
const winLossResultOptions_1 = require("./enums/winLossResultOptions");
const participantsScore_1 = require("../tournaments/models/participantsScore");
const class_transformer_1 = require("class-transformer");
class SoccerChallengeService {
    constructor() { }
    calculateMatchChallengeScoreResult(challenge, event) {
        switch (challenge.type) {
            case challengeType_1.ChallengeType.WinLoss:
                if (event.type === triggeredEventType_1.TriggeredEventType.SoccerMatchEnd) {
                    challenge.challengeParticipantsScore = new participantsScore_1.ParticipantsScore();
                    const homeScore = event.data.homeScore;
                    const awayScore = event.data.awayScore;
                    const matchWinner = homeScore > awayScore
                        ? winLossResultOptions_1.WinLossResultOptions.Home
                        : homeScore < awayScore
                            ? winLossResultOptions_1.WinLossResultOptions.Away
                            : winLossResultOptions_1.WinLossResultOptions.Tie;
                    challenge.result = new winLossChallengeResult_1.WinLossChallengeResult({ matchWinner });
                    for (const pg in challenge.participantsGuess) {
                        if (Object.prototype.hasOwnProperty.call(challenge.participantsGuess, pg)) {
                            const guess = challenge.participantsGuess[pg].matchWinner;
                            challenge.challengeParticipantsScore[pg] =
                                matchWinner === guess ? challenge.bet : 0;
                        }
                    }
                }
                break;
            case challengeType_1.ChallengeType.WinLoss:
                break;
            default:
                break;
        }
        return (0, class_transformer_1.plainToClass)(dbChallenge_1.DbChallenge, challenge);
    }
}
exports.SoccerChallengeService = SoccerChallengeService;
//# sourceMappingURL=soccerChallengeService.js.map