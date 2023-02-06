import { DbMatch } from './models/database/dbMatch';
import { MatchQuery } from './models/matchQuery';
import { TriggeredEvent } from '../../common/models/triggeredEvent';
import { MatchTriggeredEvent } from '../../common/models/matchTriggeredEvent';
import { CreateMatchRequest } from './models/requests/createMatchRequest';
import { MatchStatus } from './enums/matchStatus';
import { EventEmitter } from 'events';
import { MatchRepository } from './matchRepository';

export class MatchService extends EventEmitter {
  constructor(private matchRepository: MatchRepository) {
    super();
  }

  async createMatch(matchRequest: CreateMatchRequest) {
    // TBD - validate

    const match = this.populateMatchFromCreateRequest(matchRequest);
    const savedMatch = await this.matchRepository.insert(match);

    // notify relevant users

    return savedMatch;
  }

  async getMatchById(id: string) {
    return await this.matchRepository.findById(id);
  }

  async getMatchWithQuery(query: MatchQuery) {
    return await this.matchRepository.findOneWithQuery(query);
  }

  async updateMatchById(id: string, updateObject: any) {
    // TBD - validate

    const updatedMatch = await this.matchRepository.updateById(
      id,
      updateObject
    );

    return updatedMatch;
  }

  async updateMatchAndTriggeredEventsById(
    matchId: string,
    matchStatus: MatchStatus,
    updateObject: any,
    triggeredEvents: TriggeredEvent[] = []
  ) {
    // TBD - validate
    const dbMatch = await this.matchRepository.findOneWithQuery({ matchId });

    if (!dbMatch) {
      // write to log
      return;
    }

    const updatedMatch = await this.matchRepository.updateWithSetById(
      dbMatch._id,
      {
        ...dbMatch,
        triggeredEvents: dbMatch.triggeredEvents
          ? dbMatch.triggeredEvents.concat(triggeredEvents)
          : triggeredEvents,
        status: matchStatus,
        matchEntity: updateObject,
      }
    );

    if (
      updatedMatch.tournamentIds &&
      updatedMatch.tournamentIds.length > 0 &&
      triggeredEvents &&
      triggeredEvents.length > 0
    ) {
      const matchEvent = new MatchTriggeredEvent({
        matchId,
        tournamentIds: updatedMatch.tournamentIds,
        events: triggeredEvents,
      });
      this.triggerSignificantEvents(matchEvent);
    }

    return updatedMatch;
  }

  private populateMatchFromCreateRequest(matchRequest: CreateMatchRequest) {
    const result = new DbMatch({ ...matchRequest, triggeredEvents: [] });
    result.createdAt = new Date();
    result.updatedAt = new Date();
    result.status = MatchStatus.NotStarted;
    result.tournamentIds = [];

    return result;
  }

  private triggerSignificantEvents(event: MatchTriggeredEvent) {
    this.emit('significantEventTriggered', event);
  }
}
