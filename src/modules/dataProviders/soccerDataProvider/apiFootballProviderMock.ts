import axios from 'axios';
import { SoccerMatch } from '../../sports/soccer/models/soccerMatch';

const url = 'http://localhost:3000/fixtures?live=all';
const headers = {};

// const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all';
// const headers = {
//   'x-rapidapi-key': '*********',
//   'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
// };

export class ApiSoccerProviderMock {
  public async getMatchById(id: string): Promise<SoccerMatch | null> {
    // return LiveSoccerMatchMock1[0];
    return null;
  }

  public async getLiveMatchesByLeagueID(leagueId: string) {
    // return LiveSoccerMatchMock1[0];
  }

  public async getAllLiveMatches(): Promise<SoccerMatch[]> {
    const fixtures: any = await axios.get(`${url}`, { headers });
    return fixtures.data.response;
  }
}
