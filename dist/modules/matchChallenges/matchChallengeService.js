"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchChallengeService = void 0;
const dbMatchChallenge_1 = require("./models/database/dbMatchChallenge");
const matchChallengeChallenge_1 = require("./models/matchChallengeChallenge");
const matchChallengeStatus_1 = require("./enums/matchChallengeStatus");
const participantsScore_1 = require("../tournaments/models/participantsScore");
class MatchChallengeService {
    constructor(matchChallengeRepository, challengeService) {
        this.matchChallengeRepository = matchChallengeRepository;
        this.challengeService = challengeService;
    }
    async addMatchChallenge(matchChallengeRequest) {
        // TBD - validate
        const matchChallenge = await this.populateMatchChallengeFromRequest(matchChallengeRequest);
        const savedMatchChallenge = await this.matchChallengeRepository.insert(matchChallenge);
        return savedMatchChallenge;
    }
    async populateMatchChallengeFromRequest(matchChallengeRequest) {
        const challenges = [];
        for (const challenge of matchChallengeRequest.challenges) {
            const dbChallenge = await this.challengeService.createChallenge(challenge);
            challenges.push(new matchChallengeChallenge_1.MatchChallengeChallenge({
                challengeId: dbChallenge._id,
                challengeType: dbChallenge.type,
                resultTriggerType: dbChallenge.resultTriggerType,
            }));
        }
        const matchChallenge = new dbMatchChallenge_1.DbMatchChallenge({
            challenges,
            matchId: matchChallengeRequest.matchId,
            matchType: matchChallengeRequest.matchType,
            status: matchChallengeStatus_1.MatchChallengeStatus.NotStarted,
        });
        return matchChallenge;
    }
    async calculateAndUpdateMatchChallenge(matchChallengeId, triggeredEvents) {
        var _a, _b;
        const dbMatchChallenge = await this.matchChallengeRepository.findById(matchChallengeId);
        if (!dbMatchChallenge) {
            // throw error
            return;
        }
        if (!dbMatchChallenge.challenges ||
            dbMatchChallenge.challenges.length === 0) {
            return dbMatchChallenge;
        }
        const participantsScore = (_a = dbMatchChallenge.matchParticipantsScore) !== null && _a !== void 0 ? _a : new participantsScore_1.ParticipantsScore({});
        for (const event of triggeredEvents) {
            const challengeIndex = dbMatchChallenge.challenges.findIndex((x) => x.resultTriggerType === event.type);
            if (challengeIndex !== -1) {
                const updatedChallenge = await this.challengeService.calculateChallengeResult(dbMatchChallenge.challenges[challengeIndex].challengeId, dbMatchChallenge.matchType, event);
                for (const ps in updatedChallenge.challengeParticipantsScore) {
                    if (updatedChallenge.challengeParticipantsScore[ps] > 0) {
                        participantsScore[ps] = participantsScore[ps]
                            ? participantsScore[ps] +
                                updatedChallenge.challengeParticipantsScore[ps]
                            : updatedChallenge.challengeParticipantsScore[ps];
                    }
                    else {
                        participantsScore[ps] = (_b = participantsScore[ps]) !== null && _b !== void 0 ? _b : 0;
                    }
                }
                dbMatchChallenge.matchParticipantsScore = participantsScore;
            }
        }
        const updatedMatchChallenge = await this.matchChallengeRepository.updateWithSetById(dbMatchChallenge._id, dbMatchChallenge);
        // update matchChallenge scores - using version
        return updatedMatchChallenge;
    }
}
exports.MatchChallengeService = MatchChallengeService;
//# sourceMappingURL=matchChallengeService.js.map