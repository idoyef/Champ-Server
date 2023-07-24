import { ApiSoccerProviderMock } from '../../dataProviders/soccerDataProvider/apiFootballProviderMock';
import { SportService } from '../sportService';
import { SoccerFixtureStatusShort } from './enums/soccerStatus';
import { SoccerMatch } from './models/soccerMatch';
import { SoccerMatchRepository } from './soccerRepository';
import { SoccerIdMatchIdMappingRepository } from './soccerIdMatchIdMappingRepository';
import { EventHandler } from '../../../common/events/eventHandler';
import {
  MatchTrigger,
  SoccerMatchTrigger,
} from '../../../common/enums/matchTrigger';
import { setIntervalWrapper, setTimeoutWrapper } from '../../../utils';
import { MatchStatus } from './enums/matchStatus';
import { DbSoccerMatch } from './models/db/dbSoccerMatchBase';

const soccerMatchStatusToMatchStatusMap = {
  [SoccerFixtureStatusShort.NS]: MatchStatus.NotStarted,
  [SoccerFixtureStatusShort['1H']]: MatchStatus.InMotion,
  [SoccerFixtureStatusShort.HT]: MatchStatus.OnBreak,
  [SoccerFixtureStatusShort['2H']]: MatchStatus.InMotion,
  [SoccerFixtureStatusShort.FT]: MatchStatus.Finished,
  [SoccerFixtureStatusShort.AET]: MatchStatus.Finished,
  [SoccerFixtureStatusShort.PEN]: MatchStatus.Finished,
};

export class SoccerService implements SportService<SoccerMatch> {
  constructor(
    private footballProviderMock: ApiSoccerProviderMock,
    private soccerMatchRepository: SoccerMatchRepository,
    private soccerIdMatchIdMappingRepository: SoccerIdMatchIdMappingRepository,
    private eventHandler: EventHandler
  ) {
    this.getStartedMatches();
    setTimeoutWrapper(
      () =>
        setIntervalWrapper(() => {
          this.getStartedMatches();
        }, 2000),
      30000
    );
    // initialize scheduler for getting matches from dataProvider
  }

  async createMatch(match: Omit<SoccerMatch, 'date'>): Promise<DbSoccerMatch> {
    return await this.soccerMatchRepository.insert({
      ...match,
      date: new Date(new Date(match.fixture.date).setHours(0, 0, 0, 0)),
    });
  }

  async findMatchById(id: string): Promise<SoccerMatch> {
    return await this.soccerMatchRepository.findById(id);
  }

  async findMatchesWithQuery(query: any): Promise<SoccerMatch[]> {
    return await this.soccerMatchRepository.findManyWithQuery(query);
  }

  async getStartedMatches() {
    // get matches from dataProvider
    const matches = await this.footballProviderMock.getAllLiveMatches();

    matches.forEach(async (match) => {
      let matchId;
      let previousMatchState;
      const soccerId = match.fixture.id;
      const mapping =
        await this.soccerIdMatchIdMappingRepository.findOneWithQuery({
          soccerId,
        });

      if (!mapping) {
        const { id } = await this.createMatch(match);
        await this.soccerIdMatchIdMappingRepository.insert({
          id,
          soccerId,
        });
        matchId = id;
      } else {
        previousMatchState = await this.findMatchById(mapping.id);
        matchId = mapping.id;
      }

      this.calculateAndSendMatchTriggers(matchId, previousMatchState, match);

      if (previousMatchState) {
        await this.soccerMatchRepository.updateById(matchId, match);
      }
    });
  }

  private calculateAndSendMatchTriggers(
    matchId: string,
    previousMatchState: SoccerMatch | undefined,
    currentMatchState: SoccerMatch
  ): void {
    const matchStatus =
      soccerMatchStatusToMatchStatusMap[currentMatchState.fixture.status.short];
    // match started event
    if (!previousMatchState) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.MATCH_STARTED,
        payload: {},
      });
      return;
    }

    // score updated event
    if (
      previousMatchState.goals.home !== currentMatchState.goals.home ||
      previousMatchState.goals.away !== currentMatchState.goals.away
    ) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.UPDATE_SCORE,
        payload: { ...currentMatchState.goals },
      });
    }

    // first half finished event
    if (
      previousMatchState.fixture.status.short ===
        SoccerFixtureStatusShort['1H'] &&
      currentMatchState.fixture.status.short === SoccerFixtureStatusShort.HT
    ) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.FIRST_HALF_FINISHED,
        payload: { ...currentMatchState.goals },
      });
    }

    // match finished in the regular time
    if (
      currentMatchState.fixture.status.short === SoccerFixtureStatusShort.FT
    ) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.MATCH_FINISHED_IN_REGULAR_TIME,
        payload: { ...currentMatchState.goals },
      });
    }

    // match finished after extra time without going to the penalty shootout
    if (
      currentMatchState.fixture.status.short === SoccerFixtureStatusShort.AET
    ) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.MATCH_FINISHED_AFTER_EXTRA_TIME_BEFORE_PENALTY,
        payload: { ...currentMatchState.goals },
      });
    }

    // match finished after the penalty shootout
    if (
      currentMatchState.fixture.status.short === SoccerFixtureStatusShort.PEN
    ) {
      this.sendMatchTrigger(matchId, matchStatus, {
        type: SoccerMatchTrigger.MATCH_FINISHED_AFTER_PENALTY,
        payload: { ...currentMatchState.goals },
      });
    }
  }

  private sendMatchTrigger(
    matchId: string,
    matchStatus: MatchStatus,
    matchTrigger: MatchTrigger<SoccerMatchTrigger>
  ) {
    this.eventHandler.emit('matchTriggers', {
      matchId,
      matchStatus,
      matchTrigger,
    }); // TBD - send to matchTriggers sportEvents queue
  }
}
