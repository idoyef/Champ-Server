"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeService = void 0;
const sportType_1 = require("../../common/enums/sportType");
const dbChallenge_1 = require("./models/database/dbChallenge");
const challengeStatus_1 = require("./enums/challengeStatus");
const triggeredEventType_1 = require("../../common/enums/triggeredEventType");
const class_transformer_1 = require("class-transformer");
class ChallengeService {
    constructor(challengeRepository, soccerChallengeService, basketballChallengeService) {
        this.challengeRepository = challengeRepository;
        this.soccerChallengeService = soccerChallengeService;
        this.basketballChallengeService = basketballChallengeService;
    }
    async createChallenge(challengeRequest) {
        // TBD - validate
        const challenge = this.populateChallengeFromRequest(challengeRequest);
        return await this.challengeRepository.insert(challenge);
    }
    async updateChallengeWithQuery(query, updateObject) {
        // TBD - validate
        await this.challengeRepository.upsertOneWithQuery(query, updateObject);
    }
    async replaceChallengeWithQuery(id, challenge) {
        // TBD - validate
        return await this.challengeRepository.replaceOneWithQuery({ type: challenge.type }, challenge);
    }
    async calculateChallengeResult(challengeId, matchType, event) {
        const dbChallenge = await this.challengeRepository.findById(challengeId);
        switch (matchType) {
            case sportType_1.SportType.Soccer:
                const result = this.soccerChallengeService.calculateMatchChallengeScoreResult(dbChallenge, event);
                const updatedChallenge = await this.challengeRepository.updateWithSetById(dbChallenge._id, result);
                return class_transformer_1.plainToClass(dbChallenge_1.DbChallenge, updatedChallenge);
            default:
                return dbChallenge;
        }
    }
    populateChallengeFromRequest(challengeRequest) {
        return new dbChallenge_1.DbChallenge({
            type: challengeRequest.type,
            resultTriggerType: triggeredEventType_1.TriggeredEventType.SoccerMatchEnd,
            participantsGuess: challengeRequest.participantsGuess,
            challengeParticipantsScore: {},
            bet: challengeRequest.bet,
            status: challengeStatus_1.ChallengeStatus.NotStarted,
        });
    }
}
exports.ChallengeService = ChallengeService;
//# sourceMappingURL=challengeService.js.map