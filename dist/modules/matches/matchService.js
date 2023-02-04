"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const dbMatch_1 = require("./models/database/dbMatch");
const matchTriggeredEvent_1 = require("../../common/models/matchTriggeredEvent");
const matchStatus_1 = require("./enums/matchStatus");
const events_1 = require("events");
class MatchService extends events_1.EventEmitter {
    constructor(matchRepository) {
        super();
        this.matchRepository = matchRepository;
    }
    async createMatch(matchRequest) {
        // TBD - validate
        const match = this.populateMatchFromCreateRequest(matchRequest);
        const savedMatch = await this.matchRepository.insert(match);
        // notify relevant users
        return savedMatch;
    }
    async getMatchById(id) {
        return await this.matchRepository.findById(id);
    }
    async getMatchWithQuery(query) {
        return await this.matchRepository.findOneWithQuery(query);
    }
    async updateMatchById(id, updateObject) {
        // TBD - validate
        const updatedMatch = await this.matchRepository.updateById(id, updateObject);
        return updatedMatch;
    }
    async updateMatchAndTriggeredEventsById(matchId, matchStatus, updateObject, triggeredEvents = []) {
        // TBD - validate
        const dbMatch = await this.matchRepository.findOneWithQuery({ matchId });
        if (!dbMatch) {
            // write to log
            return;
        }
        const updatedMatch = await this.matchRepository.updateWithSetById(dbMatch._id, Object.assign(Object.assign({}, dbMatch), { triggeredEvents: dbMatch.triggeredEvents
                ? dbMatch.triggeredEvents.concat(triggeredEvents)
                : triggeredEvents, status: matchStatus, matchEntity: updateObject }));
        if (updatedMatch.tournamentIds &&
            updatedMatch.tournamentIds.length > 0 &&
            triggeredEvents &&
            triggeredEvents.length > 0) {
            const matchEvent = new matchTriggeredEvent_1.MatchTriggeredEvent({
                matchId,
                tournamentIds: updatedMatch.tournamentIds,
                events: triggeredEvents,
            });
            this.triggerSignificantEvents(matchEvent);
        }
        return updatedMatch;
    }
    populateMatchFromCreateRequest(matchRequest) {
        const result = new dbMatch_1.DbMatch(Object.assign(Object.assign({}, matchRequest), { triggeredEvents: [] }));
        result.createdAt = new Date();
        result.updatedAt = new Date();
        result.status = matchStatus_1.MatchStatus.NotStarted;
        result.tournamentIds = [];
        return result;
    }
    triggerSignificantEvents(event) {
        this.emit('significantEventTriggered', event);
    }
}
exports.MatchService = MatchService;
//# sourceMappingURL=matchService.js.map