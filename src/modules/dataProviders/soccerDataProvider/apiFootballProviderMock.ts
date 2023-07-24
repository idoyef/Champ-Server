import axios from 'axios';
import { EventType } from '../../sports/soccer/enums/events';
import {
  SoccerFixtureStatusLong,
  SoccerFixtureStatusShort,
} from '../../sports/soccer/enums/soccerStatus';
import { SoccerMatch } from '../../sports/soccer/models/soccerMatch';

let index = 0;

const url = 'http://localhost:3000/fixtures?live=all';
const headers = {};

// const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all';
// const headers = {
//   'x-rapidapi-key': '0f310d67a1mshda0cffd2bce707ep14e36bjsne2f599259e4f',
//   'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
// };

export class ApiSoccerProviderMock {
  private intervalNumber;

  constructor() {
    this.intervalNumber = setInterval(() => {
      this.getMatchForTest();
    }, 120000);
  }

  private async getMatchForTest() {}

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
    // const result = [LiveSoccerMatchMock1[index]];
    // index = index === 0 ? 1 : 0;

    // return result;
  }
}
