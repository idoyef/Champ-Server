"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentService = void 0;
const tournamentStatus_1 = require("./enums/tournamentStatus");
const tournamentMatchChallenge_1 = require("./models/tournamentMatchChallenge");
const dbTournamentBase_1 = require("./models/database/dbTournamentBase");
const matchQuery_1 = require("../matches/models/matchQuery");
const tournamentType_1 = require("./enums/tournamentType");
const class_transformer_1 = require("class-transformer");
const dbFirstToScoreTournament_1 = require("./models/database/dbFirstToScoreTournament");
const participantsScore_1 = require("./models/participantsScore");
class TournamentService {
    constructor(tournamentRepository, matchService, matchChallengeService, challengeService) {
        this.tournamentRepository = tournamentRepository;
        this.matchService = matchService;
        this.matchChallengeService = matchChallengeService;
        this.challengeService = challengeService;
        this.matchService.on('significantEventTriggered', async (event) => {
            await this.handleSignificantEventTriggered(event);
        });
    }
    async createTournament(tournamentRequest) {
        // TBD - validate
        const tournament = this.populateTournamentFromCreateRequest(tournamentRequest);
        tournament.matchChallenges = await this.populateTournamentMatchChallengesFromCreateRequest(tournamentRequest.matchChallenges);
        const savedTournament = await this.tournamentRepository.insert(tournament);
        await this.addTournamentIdToMatches(savedTournament._id, savedTournament.matchChallenges.map((x) => x.matchId));
        // TBD - notify relevant users
        return savedTournament;
    }
    async getTournamentById(id) {
        return await this.tournamentRepository.findById(id);
    }
    async getTournamentWithQuery(query) {
        return await this.tournamentRepository.findManyWithQuery(query);
    }
    // TBD version id to prevent race condition
    async updateTournamentById(tournamentRequest) {
        // TBD - validate
        const dbTournament = await this.tournamentRepository.findById(tournamentRequest.id);
        if (!dbTournament) {
            // TBD - throw exception
        }
        dbTournament.updatedAt = new Date();
        if (tournamentRequest.participantIds &&
            tournamentRequest.participantIds.length > 0) {
            //TBD - consider terms for joining new participants after the tournament began
            for (const id of tournamentRequest.participantIds) {
                if (!dbTournament.totalParticipantsScore[id]) {
                    dbTournament.totalParticipantsScore[id] = 0;
                }
            }
        }
        if (tournamentRequest.matchChallenges) {
            const newMatchIds = [];
            for (const matchChallengeToUpdate of tournamentRequest.matchChallenges) {
                const match = await this.matchService.getMatchById(matchChallengeToUpdate.matchId);
                // if (!match || match.status !== MatchStatus.NotStarted) {
                //   // aggregate error message for client: 'cannot update match challenge, match already began'
                //   continue;
                // }
                const dbMatchChallengeIndex = dbTournament.matchChallenges.findIndex((mc) => mc.matchId === matchChallengeToUpdate.matchId);
                if (dbMatchChallengeIndex === -1) {
                    const newMatchChallenge = await this.matchChallengeService.addMatchChallenge(matchChallengeToUpdate);
                    dbTournament.matchChallenges.push(new tournamentMatchChallenge_1.TournamentMatchChallenge({
                        matchChallengeId: newMatchChallenge._id,
                        matchId: matchChallengeToUpdate.matchId,
                    }));
                    newMatchIds.push(matchChallengeToUpdate.matchId);
                }
                else {
                    // update match challenge
                }
            }
        }
        const updatedTournament = await this.tournamentRepository.updateWithSetById(dbTournament._id, dbTournament);
        // notify new participants on new tournament
        // notify participants on new matches added to tournament
        return updatedTournament;
    }
    populateTournamentFromCreateRequest(tournamentRequest) {
        var _a;
        let result = {};
        result.type = tournamentRequest.type;
        result.participantIds = (_a = tournamentRequest.participantIds) !== null && _a !== void 0 ? _a : [];
        result.totalParticipantsScore = {};
        for (const id of tournamentRequest.participantIds) {
            result.totalParticipantsScore[id] = 0;
        }
        result.status = tournamentStatus_1.TournamentStatus.NotStarted;
        switch (tournamentRequest.type) {
            case tournamentType_1.TournamentType.FirstToReachScore:
                result.completionScore = tournamentRequest.completionScore;
                return (0, class_transformer_1.plainToClass)(dbFirstToScoreTournament_1.DbFirstToScoreTournamentBase, result);
            default:
                return (0, class_transformer_1.plainToClass)(dbTournamentBase_1.DbTournamentBase, result);
        }
    }
    async populateTournamentMatchChallengesFromCreateRequest(matchChallenges) {
        const result = [];
        if (matchChallenges && matchChallenges.length > 0) {
            for (const matchChallengeRequest of matchChallenges) {
                const query = new matchQuery_1.MatchQuery({
                    matchId: matchChallengeRequest.matchId,
                });
                const match = await this.matchService.getMatchWithQuery(query);
                // if (match && match.status !== MatchStatus.NotStarted) {
                //   // aggregate error message for client: 'cannot add match challenge, match already began'
                //   continue;
                // }
                const savedMatchChallenge = await this.matchChallengeService.addMatchChallenge(matchChallengeRequest);
                result.push(new tournamentMatchChallenge_1.TournamentMatchChallenge({
                    matchChallengeId: savedMatchChallenge._id,
                    matchId: matchChallengeRequest.matchId,
                }));
            }
        }
        return result;
    }
    async addTournamentIdToMatches(tournamentId, matchIds) {
        for (const matchId of matchIds) {
            const match = await this.matchService.getMatchWithQuery(new matchQuery_1.MatchQuery({ matchId }));
            await this.matchService.updateMatchById(match._id, {
                $addToSet: { tournamentIds: tournamentId },
            });
        }
    }
    async handleSignificantEventTriggered(event) {
        var _a, _b;
        const relevantTournamentIds = event.tournamentIds; // TBD - also query status active
        for (const tournamentId of relevantTournamentIds) {
            // TBD handle the process with version
            const tournament = await this.getTournamentById(tournamentId);
            const tournamentMatchChallenge = tournament.matchChallenges.find((x) => x.matchId === event.matchId);
            if (tournamentMatchChallenge) {
                const updatedMatchChallenge = await this.matchChallengeService.calculateAndUpdateMatchChallenge(tournamentMatchChallenge.matchChallengeId, event.events);
                const totalParticipantsScore = (_a = tournament.totalParticipantsScore) !== null && _a !== void 0 ? _a : new participantsScore_1.ParticipantsScore({});
                for (const ps in updatedMatchChallenge.matchParticipantsScore) {
                    if (updatedMatchChallenge.matchParticipantsScore[ps] > 0) {
                        totalParticipantsScore[ps] = totalParticipantsScore[ps]
                            ? totalParticipantsScore[ps] +
                                updatedMatchChallenge.matchParticipantsScore[ps]
                            : updatedMatchChallenge.matchParticipantsScore[ps];
                    }
                    else {
                        totalParticipantsScore[ps] = (_b = totalParticipantsScore[ps]) !== null && _b !== void 0 ? _b : 0;
                    }
                }
                tournament.totalParticipantsScore = totalParticipantsScore;
                const checkedTournament = await this.checkAndHandleFinishedTournament(tournament);
                const updatedTournament = await this.tournamentRepository.updateWithSetById(tournamentId, checkedTournament);
                // retry if version does not match
                if (updatedTournament.status === tournamentStatus_1.TournamentStatus.Finished) {
                    // handle payout
                    // notify participants
                }
            }
        }
    }
    async checkAndHandleFinishedTournament(tournament) {
        switch (tournament.type) {
            case tournamentType_1.TournamentType.FirstToReachScore:
                let winner = {
                    score: 0,
                };
                for (const participantId in tournament.totalParticipantsScore) {
                    if (Object.prototype.hasOwnProperty.call(tournament.totalParticipantsScore, participantId)) {
                        const score = tournament.totalParticipantsScore[participantId];
                        if (score >=
                            tournament.completionScore &&
                            score > winner.score) {
                            winner.id = participantId;
                            winner.score = score;
                        }
                    }
                }
                if (winner.score > 0) {
                    tournament.status = tournamentStatus_1.TournamentStatus.Finished;
                    tournament.winnerId = winner.id;
                }
                break;
            default:
                break;
        }
        return tournament;
    }
}
exports.TournamentService = TournamentService;
//# sourceMappingURL=tournamentService.js.map