"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFootballProvider = void 0;
const soccerMatch_1 = require("../../sports/soccer/models/soccerMatch");
const moment_1 = __importDefault(require("moment"));
const soccerMatchStatus_1 = require("../../sports/soccer/enums/soccerMatchStatus");
// const baseApiProviderUrl = 'https://api-football-v1.p.rapidapi.com/v2';
const baseApiProviderUrl = 'http://localhost:5010';
// const baseApiProviderUrl = 'https://v3.football.api-sports.io';
const baseApiV3ProviderUrl = 'http://localhost:5010';
const headers = {};
// const headers = {
//   'x-apisports-key': 'fc02f01453c2297814933a9eeabb4701',
// };
class ApiFootballProvider {
    constructor(apiWrapper) {
        this.apiWrapper = apiWrapper;
    }
    async getMatchById(id) {
        const match = await this.apiWrapper.get(
        // `${baseApiProviderUrl}/fixtures?id=${+id}`,
        `http://localhost:3000/fixtures/${+id}`, 
        // headers
        {});
        return match.data.results !== 0
            ? this.populateMatch(match.data.response[0])
            : null;
    }
    async getLiveMatchesByLeagueID(leagueId) {
        var _a;
        const result = await this.apiWrapper.get(`${baseApiV3ProviderUrl}/${leagueId}/fixtures/live=all`, headers);
        const footballMatches = (_a = result.data.response) === null || _a === void 0 ? void 0 : _a.map((match) => this.populateMatch(match));
        return footballMatches !== null && footballMatches !== void 0 ? footballMatches : [];
    }
    async getLeaguesNextMatches(leaguesIds, amount) {
        let matches = [];
        for (const id of leaguesIds) {
            const result = await this.apiWrapper.get(`${baseApiProviderUrl}/fixtures?league=${id}&next=${amount}`, 
            // 'http://localhost:3000/fixtures',
            headers
            // {}
            );
            matches = matches.concat(result.data.response);
        }
        const footballMatches = matches.map((match) => this.populateMatch(match));
        return footballMatches;
    }
    async getAllLiveMatches() {
        let matches = [];
        const result = await this.apiWrapper.get(
        // `${baseApiProviderUrl}/fixtures?live=all`,
        'http://localhost:3000/fixtures', 
        // headers
        {});
        matches = matches.concat(result.data.response);
        const footballMatches = matches.map((match) => this.populateMatch(match));
        return footballMatches;
    }
    async getLeaguesMatchesByDateRange(leaguesIds, from, to) {
        let matches = [];
        // const datesToUpdate = this.getDates(from, to);
        // for (const id of leaguesIds) {
        //   for (const date of datesToUpdate) {
        //     const result = await this.apiWrapper.get(
        //       `${baseApiProviderUrl}/fixtures/league/${id}/${date}/sssss`,
        //       headers
        //     );
        //     matches = matches.concat(result.data.api.fixtures);
        //   }
        // }
        ///////
        const soccerMatches = [];
        const match = await this.apiWrapper.get('http://localhost:5010/matches', 
        // `${baseApiProviderUrl}/fixtures/id/${id}`,
        headers);
        matches = match.data;
        ///////
        if (matches.length > 0) {
            for (const match of matches) {
                soccerMatches.push(this.populateMatch(match));
            }
        }
        return soccerMatches;
    }
    getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment_1.default(startDate);
        var endDate = moment_1.default(stopDate);
        while (currentDate <= endDate) {
            dateArray.push(moment_1.default(currentDate).format('YYYY-MM-DD'));
            currentDate = moment_1.default(currentDate).add(1, 'days');
        }
        return dateArray;
    }
    populateMatch(match) {
        var _a, _b, _c;
        if (match.fixture.status.elapsed === 86) {
            console.log(match);
        }
        return new soccerMatch_1.SoccerMatch({
            matchId: match.fixture.id.toString(),
            leagueId: match.league.id,
            league: match.league,
            eventDate: new Date(match.fixture.date),
            eventTimestamp: match.fixture.timestamp,
            round: match.league.round,
            status: this.convertToSoccerMatchStatus(match.fixture.status.short),
            elapsed: match.fixture.status.elapsed,
            venue: match.fixture.venue,
            referee: match.fixture.referee,
            homeTeam: match.teams.home,
            awayTeam: match.teams.away,
            goalsHomeTeam: (_a = match.goals.home) !== null && _a !== void 0 ? _a : 0,
            goalsAwayTeam: (_b = match.goals.away) !== null && _b !== void 0 ? _b : 0,
            score: match.score,
            events: (_c = match.events) !== null && _c !== void 0 ? _c : [],
        });
    }
    convertToSoccerMatchStatus(shortStatus) {
        switch (shortStatus) {
            case 'NS':
                return soccerMatchStatus_1.SoccerMatchStatus.NotStarted;
            case '1H':
                return soccerMatchStatus_1.SoccerMatchStatus.FirstHalf;
            case 'HT':
                return soccerMatchStatus_1.SoccerMatchStatus.HalfTime;
            case '2H':
                return soccerMatchStatus_1.SoccerMatchStatus.SecondHalf;
            case 'ET':
                return soccerMatchStatus_1.SoccerMatchStatus.ExtraTime;
            case 'P':
                return soccerMatchStatus_1.SoccerMatchStatus.PenaltyInProgress;
            case 'FT':
                return soccerMatchStatus_1.SoccerMatchStatus.Finished;
            default:
                return soccerMatchStatus_1.SoccerMatchStatus.NotStarted;
        }
    }
}
exports.ApiFootballProvider = ApiFootballProvider;
//# sourceMappingURL=apiFootballProvider.js.map