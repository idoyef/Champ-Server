import { IDataSourceProvider } from '../../dataProviders/IDataSourceProvider';
import { MatchService } from '../../matches/matchService';
import { SportType } from '../../../common/enums/sportType';
import { soccerConfig } from '../../../configuration';
import { SoccerMatch } from './models/soccerMatch';
import { IScheduler } from '../../../utils/scheduler/IScheduler';
import { Schedule } from '../../../utils/scheduler/schedule';
import { ScheduleType } from '../../../utils/scheduler/scheduleType';
import { addDays } from '../../../utils/helpers/dateHelper';
import { MetadataService } from '../../metadata/metadataService';
import { ScheduleQuery } from '../../../utils/scheduler/scheduleQuery';
import { Interval } from '../../../utils/scheduler/interval';
import { plainToClass } from 'class-transformer';
import { TriggeredEvent } from '../../../common/models/triggeredEvent';
import { TriggeredEventType } from '../../../common/enums/triggeredEventType';
import { SoccerMatchEndDetails } from '../../../common/models/triggers/soccer/soccerMatchEndDetails';
import { SoccerMatchHalfTimeDetails } from '../../../common/models/triggers/soccer/soccerMatchHalfTimeDetails';
import { SoccerGoalScoreDetails } from '../../../common/models/triggers/soccer/soccerGoalScoreDetails';
import { CreateMatchRequest } from '../../matches/models/requests/createMatchRequest';
import { SoccerRepository } from './soccerRepository';
import { MatchStatus } from '../../matches/enums/matchStatus';
import { SoccerMatchStatus } from './enums/soccerMatchStatus';
import { SoccerTime } from './models/soccerTime';
import { SoccerTeam } from './models/soccerTeam';
import Agenda from 'agenda';

const serviceName = 'SoccerService';

const soccerFutureMatchesConsumer = 'soccerFutureMatchesConsumer';
const newActiveSoccerMatchConsumer = 'newActiveSoccerMatchConsumer';
const activeSoccerMatchesConsumer = 'activeSoccerMatchesConsumer';
const soccerFutureMatchesJob = 'soccerFutureMatchesJob';
const activeSoccerMatchesHandlerJob = 'activeSoccerMatchesHandlerJob';
const newActiveSoccerMatch = 'newActiveSoccerMatch';

export class SoccerService {
  matchesMetaData: any;
  activeMatchIds: string[] = [];

  constructor(
    private dataSourceProvider: IDataSourceProvider,
    private soccerRepository: SoccerRepository,
    private matchService: MatchService,
    private scheduler: IScheduler
  ) {
    this.registerSchedulerConsumers();

    setTimeout(async () => await this.init(), 6000);
  }

  async init() {
    await this.setActiveMatchesScheduler();
    await this.initFutureMatchesSchedule();
    // handle recovery in case of current matches while server uploads
  }

  private registerSchedulerConsumers() {
    this.scheduler.register(
      soccerFutureMatchesConsumer,
      [soccerFutureMatchesJob],
      this.onScheduleGetSoccerFutureMatches.bind(this)
    );

    this.scheduler.register(
      newActiveSoccerMatchConsumer,
      [newActiveSoccerMatch],
      this.onScheduleAddNewActiveSoccerMatch.bind(this)
    );

    this.scheduler.register(
      activeSoccerMatchesConsumer,
      [activeSoccerMatchesHandlerJob],
      this.onScheduleHandleActiveMatches.bind(this)
    );
  }

  private async onScheduleGetSoccerFutureMatches() {
    console.log(soccerFutureMatchesJob, new Date());

    this.handleSoccerFutureMatches();
  }

  private async handleSoccerFutureMatches() {
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
        await this.matchService.createMatch(
          new CreateMatchRequest({
            type: SportType.Soccer,
            matchId: (dbSoccerMatch as any)._id,
            matchEntity: match,
            status: MatchStatus.NotStarted,
          })
        );

        const schedule = new Schedule({
          consumer: newActiveSoccerMatchConsumer,
          start: new Date(match.eventDate.getTime() - 5 * 60000),
          type: ScheduleType.Once,
          jobInfo: { jobName: newActiveSoccerMatch, matchId: match.matchId },
        });

        await this.scheduler.addSchedule(schedule);
      }
    }
  }

  private async onScheduleAddNewActiveSoccerMatch(job: Agenda.Job) {
    console.log(newActiveSoccerMatch, new Date());
    this.activeMatchIds.push(job.attrs.data.jobInfo.matchId);
  }

  private async onScheduleHandleActiveMatches(job: Agenda.Job) {
    console.log('onScheduleHandleActiveMatches', new Date());

    if (this.activeMatchIds.length > 0) {
      const liveMatches = await this.dataSourceProvider.getAllLiveMatches();

      for (const activeMatchId of this.activeMatchIds) {
        let liveMatch =
          liveMatches.find((m) => m.matchId === activeMatchId) ?? null;
        const dbSoccerMatch = await this.soccerRepository.findOneWithQuery({
          matchId: activeMatchId,
        });

        let triggeredEvents;
        let matchToUpdate;

        if (!liveMatch && dbSoccerMatch.status !== MatchStatus.NotStarted) {
          liveMatch = await this.dataSourceProvider.getMatchById(activeMatchId);
        }

        if (liveMatch) {
          const mergedMatchState = this.mergeCurrentAndPreviousMatchState(
            dbSoccerMatch,
            liveMatch
          );

          matchToUpdate = mergedMatchState.match;
          triggeredEvents = mergedMatchState.triggeredEvents;
        }

        if (matchToUpdate) {
          const updated = await this.soccerRepository.updateWithSetById(
            dbSoccerMatch._id,
            matchToUpdate
          );
          if (!updated.events || updated.events.length === 0) {
            console.log(JSON.stringify(updated.events));
          }
          await this.matchService.updateMatchAndTriggeredEventsById(
            dbSoccerMatch._id,
            this.convertSoccerMatchStatusToMatchStatus(matchToUpdate.status),
            matchToUpdate,
            triggeredEvents
          );

          if (matchToUpdate.status === MatchStatus.Finished) {
            this.activeMatchIds = this.activeMatchIds.filter(
              (x) => x !== activeMatchId
            );
          }
        }
      }
    }
  }

  private convertSoccerMatchStatusToMatchStatus(
    status: SoccerMatchStatus
  ): MatchStatus {
    switch (status) {
      case SoccerMatchStatus.NotStarted:
        return MatchStatus.NotStarted;
      case SoccerMatchStatus.FirstHalf:
      case SoccerMatchStatus.SecondHalf:
      case SoccerMatchStatus.ExtraTime:
      case SoccerMatchStatus.PenaltyInProgress:
        return MatchStatus.Started;
      case SoccerMatchStatus.HalfTime:
        return MatchStatus.OnBreak;
      case SoccerMatchStatus.Finished:
        return MatchStatus.Finished;
      default:
        return MatchStatus.NotStarted;
    }
  }

  private async setActiveMatchesScheduler() {
    const jobs = await this.scheduler.getScheduleWithQuery(
      new ScheduleQuery({ jobName: activeSoccerMatchesHandlerJob })
    );

    if (jobs.length === 0) {
      const schedule = new Schedule({
        consumer: activeSoccerMatchesConsumer,
        start: new Date(),
        type: ScheduleType.Interval,
        interval: new Interval({
          every: '2 minutes',
        }),
        jobInfo: { jobName: activeSoccerMatchesHandlerJob },
      });
      await this.scheduler.addSchedule(schedule);
    }
  }

  private async initFutureMatchesSchedule() {
    const jobs = await this.scheduler.getScheduleWithQuery(
      new ScheduleQuery({ jobName: soccerFutureMatchesJob })
    );

    if (jobs.length === 0) {
      await this.handleSoccerFutureMatches();

      const nextSchedule = addDays(new Date(), 1);
      nextSchedule.setHours(6, 0, 0);

      const schedule = new Schedule({
        consumer: soccerFutureMatchesConsumer,
        start: nextSchedule,
        type: ScheduleType.Interval,
        interval: new Interval({
          every: '24 hours',
        }),
        jobInfo: { jobName: soccerFutureMatchesJob },
      });

      await this.scheduler.addSchedule(schedule);
    }
  }

  private mergeCurrentAndPreviousMatchState(
    previousMatchState: SoccerMatch,
    currentMatchState: SoccerMatch
  ): { match: SoccerMatch; triggeredEvents: TriggeredEvent[] } {
    console.log(
      `previousMatchState---------------> ${JSON.stringify(previousMatchState)}`
    );
    console.log(
      `currentMatchState---------------> ${JSON.stringify(currentMatchState)}`
    );

    if (currentMatchState.status === SoccerMatchStatus.Finished) {
      console.log();
    }

    let triggeredEvents: TriggeredEvent[] = [];
    const result = plainToClass(SoccerMatch, currentMatchState);

    const mergedEvents = this.handleNewMatchEvents(
      previousMatchState.events,
      currentMatchState.events
    );

    triggeredEvents = triggeredEvents.concat(mergedEvents.triggeredEvents);

    if (previousMatchState.status !== currentMatchState.status) {
      const statusTriggeredEvents =
        this.calculateStatusTriggeredEvents(currentMatchState);

      triggeredEvents = triggeredEvents.concat(statusTriggeredEvents);
    }

    // TBD - continue merge current and previous states

    return { triggeredEvents, match: result };
  }

  private calculateStatusTriggeredEvents(
    currentMatchState: SoccerMatch
  ): TriggeredEvent[] {
    let triggeredEvents: TriggeredEvent[] = [];

    switch (currentMatchState.status) {
      case SoccerMatchStatus.HalfTime:
        const halfTimeEvent = new TriggeredEvent({
          type: TriggeredEventType.SoccerMatchHalfTime,
          data: new SoccerMatchHalfTimeDetails({
            homeScore: currentMatchState.goalsHomeTeam,
            awayScore: currentMatchState.goalsAwayTeam,
          }),
        });
        triggeredEvents.push(halfTimeEvent);
        break;
      case SoccerMatchStatus.Finished:
        const finishedEvent = new TriggeredEvent({
          type: TriggeredEventType.SoccerMatchEnd,
          data: new SoccerMatchEndDetails({
            homeScore: currentMatchState.goalsHomeTeam,
            awayScore: currentMatchState.goalsAwayTeam,
          }),
        });
        triggeredEvents.push(finishedEvent);
        break;
    }

    return triggeredEvents;
  }

  private handleNewMatchEvents(
    previousEvents: any[],
    newEvents: any[]
  ): { events: any[]; triggeredEvents: TriggeredEvent[] } {
    let triggeredEvents: TriggeredEvent[] = [];
    let events: any[] = previousEvents;

    if (previousEvents && previousEvents.length < newEvents.length) {
      const eventsDiff = newEvents.slice(previousEvents.length);
      triggeredEvents = this.calculateTriggeredEventsByEvents(eventsDiff);
      events = newEvents;
    }

    return { events, triggeredEvents };
  }

  private calculateTriggeredEventsByEvents(events: any[]): TriggeredEvent[] {
    const triggeredEvents: TriggeredEvent[] = [];

    for (const event of events) {
      switch (event.type) {
        case 'Goal':
          triggeredEvents.push(
            new TriggeredEvent({
              type: TriggeredEventType.SoccerGoalScore,
              data: new SoccerGoalScoreDetails({
                team: new SoccerTeam({
                  id: event.team.id,
                  logo: event.team.logo,
                  name: event.team.name,
                }),
                scorer: event.player.name,
                assistant: event.assist.name,
                time: new SoccerTime({
                  elapsed: event.time.elapsed,
                  extra: event.time.extra,
                }),
                isOwnGoal: event.detail === 'Own Goal',
              }),
            })
          );
          break;

        default:
          break;
      }
    }

    return triggeredEvents;
  }
}
