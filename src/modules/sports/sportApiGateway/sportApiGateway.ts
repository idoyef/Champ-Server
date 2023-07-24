import { SportType } from '../../../common/enums/sportType';
import { SoccerService } from '../soccer/soccerService';
import { FindMatchesBySportQuery } from './types';

export class SportApiGateway {
  constructor(private soccerService: SoccerService) {}

  async findMatches(query: FindMatchesBySportQuery): Promise<any> {
    switch (query.sportType) {
      case SportType.Soccer:
        return await this.soccerService.findMatchesWithQuery(query);
      default:
        return [];
    }
  }
}
