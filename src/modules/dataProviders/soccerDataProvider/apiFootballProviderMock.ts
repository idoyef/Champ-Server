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
