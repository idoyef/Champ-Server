"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoccerService = void 0;
const sportType_1 = require("../../../common/enums/sportType");
const soccerMatch_1 = require("./models/soccerMatch");
const schedule_1 = require("../../../utils/scheduler/schedule");
const scheduleType_1 = require("../../../utils/scheduler/scheduleType");
const dateHelper_1 = require("../../../utils/helpers/dateHelper");
const scheduleQuery_1 = require("../../../utils/scheduler/scheduleQuery");
const interval_1 = require("../../../utils/scheduler/interval");
const class_transformer_1 = require("class-transformer");
const triggeredEvent_1 = require("../../../common/models/triggeredEvent");
const triggeredEventType_1 = require("../../../common/enums/triggeredEventType");
const soccerMatchEndDetails_1 = require("../../../common/models/triggers/soccer/soccerMatchEndDetails");
const soccerMatchHalfTimeDetails_1 = require("../../../common/models/triggers/soccer/soccerMatchHalfTimeDetails");
const soccerGoalScoreDetails_1 = require("../../../common/models/triggers/soccer/soccerGoalScoreDetails");
const createMatchRequest_1 = require("../../matches/models/requests/createMatchRequest");
const matchStatus_1 = require("../../matches/enums/matchStatus");
const soccerMatchStatus_1 = require("./enums/soccerMatchStatus");
const soccerTime_1 = require("./models/soccerTime");
const soccerTeam_1 = require("./models/soccerTeam");
const serviceName = 'SoccerService';
const soccerFutureMatchesConsumer = 'soccerFutureMatchesConsumer';
const newActiveSoccerMatchConsumer = 'newActiveSoccerMatchConsumer';
const activeSoccerMatchesConsumer = 'activeSoccerMatchesConsumer';
const soccerFutureMatchesJob = 'soccerFutureMatchesJob';
const activeSoccerMatchesHandlerJob = 'activeSoccerMatchesHandlerJob';
const newActiveSoccerMatch = 'newActiveSoccerMatch';
class SoccerService {
    constructor(dataSourceProvider, soccerRepository, matchService, scheduler) {
        this.dataSourceProvider = dataSourceProvider;
        this.soccerRepository = soccerRepository;
        this.matchService = matchService;
        this.scheduler = scheduler;
        this.activeMatchIds = [];
        this.registerSchedulerConsumers();
        setTimeout(async () => await this.init(), 6000);
    }
    async init() {
        await this.setActiveMatchesScheduler();
        await this.initFutureMatchesSchedule();
        // handle recovery in case of current matches while server uploads
    }
    registerSchedulerConsumers() {
        this.scheduler.register(soccerFutureMatchesConsumer, [soccerFutureMatchesJob], this.onScheduleGetSoccerFutureMatches.bind(this));
        this.scheduler.register(newActiveSoccerMatchConsumer, [newActiveSoccerMatch], this.onScheduleAddNewActiveSoccerMatch.bind(this));
        this.scheduler.register(activeSoccerMatchesConsumer, [activeSoccerMatchesHandlerJob], this.onScheduleHandleActiveMatches.bind(this));
    }
    async onScheduleGetSoccerFutureMatches() {
        console.log(soccerFutureMatchesJob, new Date());
        this.handleSoccerFutureMatches();
    }
    async handleSoccerFutureMatches() {
        // const futureMatches = await this.dataSourceProvider.getLeaguesNextMatches(
        //   soccerConfig.leaguesIds,
        //   soccerConfig.defaultNextFutureMatchesAmount
        // );
        const futureMatches = await this.dataSourceProvider.getAllLiveMatches();
        for (const match of futureMatches) {
            const dbMatch = await this.soccerRepository.findOneWithQuery({
                matchId: match.matchId,
            });
            if (!dbMatch) {
                const dbSoccerMatch = await this.soccerRepository.insert(match);
                await this.matchService.createMatch(new createMatchRequest_1.CreateMatchRequest({
                    type: sportType_1.SportType.Soccer,
                    matchId: dbSoccerMatch._id,
                    matchEntity: match,
                    status: matchStatus_1.MatchStatus.NotStarted,
                }));
                const schedule = new schedule_1.Schedule({
                    consumer: newActiveSoccerMatchConsumer,
                    start: new Date(match.eventDate.getTime() - 5 * 60000),
                    type: scheduleType_1.ScheduleType.Once,
                    jobInfo: { jobName: newActiveSoccerMatch, matchId: match.matchId },
                });
                await this.scheduler.addSchedule(schedule);
            }
        }
    }
    async onScheduleAddNewActiveSoccerMatch(job) {
        console.log(newActiveSoccerMatch, new Date());
        this.activeMatchIds.push(job.attrs.data.jobInfo.matchId);
    }
    async onScheduleHandleActiveMatches(job) {
        var _a;
        console.log('onScheduleHandleActiveMatches', new Date());
        if (this.activeMatchIds.length > 0) {
            const liveMatches = await this.dataSourceProvider.getAllLiveMatches();
            for (const activeMatchId of this.activeMatchIds) {
                let liveMatch = (_a = liveMatches.find((m) => m.matchId === activeMatchId)) !== null && _a !== void 0 ? _a : null;
                const dbSoccerMatch = await this.soccerRepository.findOneWithQuery({
                    matchId: activeMatchId,
                });
                let triggeredEvents;
                let matchToUpdate;
                if (!liveMatch && dbSoccerMatch.status !== matchStatus_1.MatchStatus.NotStarted) {
                    liveMatch = await this.dataSourceProvider.getMatchById(activeMatchId);
                }
                if (liveMatch) {
                    const mergedMatchState = this.mergeCurrentAndPreviousMatchState(dbSoccerMatch, liveMatch);
                    matchToUpdate = mergedMatchState.match;
                    triggeredEvents = mergedMatchState.triggeredEvents;
                }
                if (matchToUpdate) {
                    const updated = await this.soccerRepository.updateWithSetById(dbSoccerMatch._id, matchToUpdate);
                    if (!updated.events || updated.events.length === 0) {
                        console.log(JSON.stringify(updated.events));
                    }
                    await this.matchService.updateMatchAndTriggeredEventsById(dbSoccerMatch._id, this.convertSoccerMatchStatusToMatchStatus(matchToUpdate.status), matchToUpdate, triggeredEvents);
                    if (matchToUpdate.status === matchStatus_1.MatchStatus.Finished) {
                        this.activeMatchIds = this.activeMatchIds.filter((x) => x !== activeMatchId);
                    }
                }
            }
        }
    }
    convertSoccerMatchStatusToMatchStatus(status) {
        switch (status) {
            case soccerMatchStatus_1.SoccerMatchStatus.NotStarted:
                return matchStatus_1.MatchStatus.NotStarted;
            case soccerMatchStatus_1.SoccerMatchStatus.FirstHalf:
            case soccerMatchStatus_1.SoccerMatchStatus.SecondHalf:
            case soccerMatchStatus_1.SoccerMatchStatus.ExtraTime:
            case soccerMatchStatus_1.SoccerMatchStatus.PenaltyInProgress:
                return matchStatus_1.MatchStatus.Started;
            case soccerMatchStatus_1.SoccerMatchStatus.HalfTime:
                return matchStatus_1.MatchStatus.OnBreak;
            case soccerMatchStatus_1.SoccerMatchStatus.Finished:
                return matchStatus_1.MatchStatus.Finished;
            default:
                return matchStatus_1.MatchStatus.NotStarted;
        }
    }
    async setActiveMatchesScheduler() {
        const jobs = await this.scheduler.getScheduleWithQuery(new scheduleQuery_1.ScheduleQuery({ jobName: activeSoccerMatchesHandlerJob }));
        if (jobs.length === 0) {
            const schedule = new schedule_1.Schedule({
                consumer: activeSoccerMatchesConsumer,
                start: new Date(),
                type: scheduleType_1.ScheduleType.Interval,
                interval: new interval_1.Interval({
                    every: '2 minutes',
                }),
                jobInfo: { jobName: activeSoccerMatchesHandlerJob },
            });
            await this.scheduler.addSchedule(schedule);
        }
    }
    async initFutureMatchesSchedule() {
        const jobs = await this.scheduler.getScheduleWithQuery(new scheduleQuery_1.ScheduleQuery({ jobName: soccerFutureMatchesJob }));
        if (jobs.length === 0) {
            await this.handleSoccerFutureMatches();
            const nextSchedule = dateHelper_1.addDays(new Date(), 1);
            nextSchedule.setHours(6, 0, 0);
            const schedule = new schedule_1.Schedule({
                consumer: soccerFutureMatchesConsumer,
                start: nextSchedule,
                type: scheduleType_1.ScheduleType.Interval,
                interval: new interval_1.Interval({
                    every: '24 hours',
                }),
                jobInfo: { jobName: soccerFutureMatchesJob },
            });
            await this.scheduler.addSchedule(schedule);
        }
    }
    mergeCurrentAndPreviousMatchState(previousMatchState, currentMatchState) {
        console.log(`previousMatchState---------------> ${JSON.stringify(previousMatchState)}`);
        console.log(`currentMatchState---------------> ${JSON.stringify(currentMatchState)}`);
        if (currentMatchState.status === soccerMatchStatus_1.SoccerMatchStatus.Finished) {
            console.log();
        }
        let triggeredEvents = [];
        const result = class_transformer_1.plainToClass(soccerMatch_1.SoccerMatch, currentMatchState);
        const mergedEvents = this.handleNewMatchEvents(previousMatchState.events, currentMatchState.events);
        triggeredEvents = triggeredEvents.concat(mergedEvents.triggeredEvents);
        if (previousMatchState.status !== currentMatchState.status) {
            const statusTriggeredEvents = this.calculateStatusTriggeredEvents(currentMatchState);
            triggeredEvents = triggeredEvents.concat(statusTriggeredEvents);
        }
        // TBD - continue merge current and previous states
        return { triggeredEvents, match: result };
    }
    calculateStatusTriggeredEvents(currentMatchState) {
        let triggeredEvents = [];
        switch (currentMatchState.status) {
            case soccerMatchStatus_1.SoccerMatchStatus.HalfTime:
                const halfTimeEvent = new triggeredEvent_1.TriggeredEvent({
                    type: triggeredEventType_1.TriggeredEventType.SoccerMatchHalfTime,
                    data: new soccerMatchHalfTimeDetails_1.SoccerMatchHalfTimeDetails({
                        homeScore: currentMatchState.goalsHomeTeam,
                        awayScore: currentMatchState.goalsAwayTeam,
                    }),
                });
                triggeredEvents.push(halfTimeEvent);
                break;
            case soccerMatchStatus_1.SoccerMatchStatus.Finished:
                const finishedEvent = new triggeredEvent_1.TriggeredEvent({
                    type: triggeredEventType_1.TriggeredEventType.SoccerMatchEnd,
                    data: new soccerMatchEndDetails_1.SoccerMatchEndDetails({
                        homeScore: currentMatchState.goalsHomeTeam,
                        awayScore: currentMatchState.goalsAwayTeam,
                    }),
                });
                triggeredEvents.push(finishedEvent);
                break;
        }
        return triggeredEvents;
    }
    handleNewMatchEvents(previousEvents, newEvents) {
        let triggeredEvents = [];
        let events = previousEvents;
        if (previousEvents && previousEvents.length < newEvents.length) {
            const eventsDiff = newEvents.slice(previousEvents.length);
            triggeredEvents = this.calculateTriggeredEventsByEvents(eventsDiff);
            events = newEvents;
        }
        return { events, triggeredEvents };
    }
    calculateTriggeredEventsByEvents(events) {
        const triggeredEvents = [];
        for (const event of events) {
            switch (event.type) {
                case 'Goal':
                    triggeredEvents.push(new triggeredEvent_1.TriggeredEvent({
                        type: triggeredEventType_1.TriggeredEventType.SoccerGoalScore,
                        data: new soccerGoalScoreDetails_1.SoccerGoalScoreDetails({
                            team: new soccerTeam_1.SoccerTeam({
                                id: event.team.id,
                                logo: event.team.logo,
                                name: event.team.name,
                            }),
                            scorer: event.player.name,
                            assistant: event.assist.name,
                            time: new soccerTime_1.SoccerTime({
                                elapsed: event.time.elapsed,
                                extra: event.time.extra,
                            }),
                            isOwnGoal: event.detail === 'Own Goal',
                        }),
                    }));
                    break;
                default:
                    break;
            }
        }
        return triggeredEvents;
    }
}
exports.SoccerService = SoccerService;
//# sourceMappingURL=soccerService.js.map