import { SoccerMatch } from '../sports/soccer/models/soccerMatch';

export interface IDataSourceProvider {
  getMatchById(id: string): Promise<SoccerMatch | null>;
  getLeaguesNextMatches(
    leaguesIds: string[],
    amount: number
  ): Promise<SoccerMatch[]>;
  getAllLiveMatches(): Promise<SoccerMatch[]>;
  getLeaguesMatchesByDateRange(
    leaguesIds: string[],
    from: Date,
    to: Date
  ): Promise<SoccerMatch[]>;
}
