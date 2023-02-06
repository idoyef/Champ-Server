import { IDataSourceProvider } from '../IDataSourceProvider';
import { SoccerMatch } from '../../sports/soccer/models/soccerMatch';
import { ApiWrapper } from '../../../utils/apiWrapper';
import moment from 'moment';
import { SoccerMatchStatus } from '../../sports/soccer/enums/soccerMatchStatus';

// const baseApiProviderUrl = 'https://api-football-v1.p.rapidapi.com/v2';
const baseApiProviderUrl = 'http://localhost:5010';
// const baseApiProviderUrl = 'https://v3.football.api-sports.io';
const baseApiV3ProviderUrl = 'http://localhost:5010';
const headers = {};
// const headers = {
//   'x-apisports-key': 'fc02f01453c2297814933a9eeabb4701',
// };

export class ApiFootballProvider implements IDataSourceProvider {
  constructor(private apiWrapper: ApiWrapper) {}

  public async getMatchById(id: string): Promise<SoccerMatch | null> {
    const match = await this.apiWrapper.get(
      // `${baseApiProviderUrl}/fixtures?id=${+id}`,
      `http://localhost:3000/fixtures/${+id}`,
      // headers
      {}
    );

    return match.data.results !== 0
      ? this.populateMatch(match.data.response[0])
      : null;
  }

  public async getLiveMatchesByLeagueID(leagueId: string) {
    const result = await this.apiWrapper.get(
      `${baseApiV3ProviderUrl}/${leagueId}/fixtures/live=all`,
      headers
    );

    const footballMatches = result.data.response?.map((match: any) =>
      this.populateMatch(match)
    );

    return footballMatches ?? [];
  }

  public async getLeaguesNextMatches(
    leaguesIds: string[],
    amount: number
  ): Promise<SoccerMatch[]> {
    let matches: any = [];
    for (const id of leaguesIds) {
      const result: any = await this.apiWrapper.get(
        `${baseApiProviderUrl}/fixtures?league=${id}&next=${amount}`,
        // 'http://localhost:3000/fixtures',
        headers
        // {}
      );
      matches = matches.concat(result.data.response);
    }

    const footballMatches = matches.map((match: any) =>
      this.populateMatch(match)
    );

    return footballMatches;
  }

  public async getAllLiveMatches(): Promise<SoccerMatch[]> {
    let matches: SoccerMatch[] = [];
    const result: any = await this.apiWrapper.get(
      // `${baseApiProviderUrl}/fixtures?live=all`,
      'http://localhost:3000/fixtures',
      // headers
      {}
    );
    matches = matches.concat(result.data.response);

    const footballMatches = matches.map((match: any) =>
      this.populateMatch(match)
    );

    return footballMatches;
  }

  public async getLeaguesMatchesByDateRange(
    leaguesIds: string[],
    from: Date,
    to: Date
  ): Promise<SoccerMatch[]> {
    let matches = [];

    // const datesToUpdate = this.getDates(from, to);
    // for (const id of leaguesIds) {
    //   for (const date of datesToUpdate) {
    //     const result = await this.apiWrapper.get(
    //       `${baseApiProviderUrl}/fixtures/league/${id}/${date}/sssss`,
    //       headers
    //     );

    //     matches = matches.concat(result.data.api.fixtures);
    //   }
    // }

    ///////
    const soccerMatches: SoccerMatch[] = [];
    const match = await this.apiWrapper.get(
      'http://localhost:5010/matches',
      // `${baseApiProviderUrl}/fixtures/id/${id}`,
      headers
    );
    matches = match.data;
    ///////
    if (matches.length > 0) {
      for (const match of matches) {
        soccerMatches.push(this.populateMatch(match));
      }
    }

    return soccerMatches;
  }

  public getDates(startDate: Date, stopDate: Date): string[] {
    var dateArray = [];
    var currentDate = moment(startDate);
    var endDate = moment(stopDate);
    while (currentDate <= endDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  public populateMatch(match: any): SoccerMatch {
    if (match.fixture.status.elapsed === 86) {
      console.log(match);
    }
    return new SoccerMatch({
      matchId: match.fixture.id.toString(),
      leagueId: match.league.id,
      league: match.league,
      eventDate: new Date(match.fixture.date),
      eventTimestamp: match.fixture.timestamp,
      round: match.league.round,
      status: this.convertToSoccerMatchStatus(match.fixture.status.short),
      elapsed: match.fixture.status.elapsed,
      venue: match.fixture.venue,
      referee: match.fixture.referee,
      homeTeam: match.teams.home,
      awayTeam: match.teams.away,
      goalsHomeTeam: match.goals.home ?? 0,
      goalsAwayTeam: match.goals.away ?? 0,
      score: match.score,
      events: match.events ?? [],
    });
  }

  private convertToSoccerMatchStatus(shortStatus: string): SoccerMatchStatus {
    switch (shortStatus) {
      case 'NS':
        return SoccerMatchStatus.NotStarted;
      case '1H':
        return SoccerMatchStatus.FirstHalf;
      case 'HT':
        return SoccerMatchStatus.HalfTime;
      case '2H':
        return SoccerMatchStatus.SecondHalf;
      case 'ET':
        return SoccerMatchStatus.ExtraTime;
      case 'P':
        return SoccerMatchStatus.PenaltyInProgress;
      case 'FT':
        return SoccerMatchStatus.Finished;
      default:
        return SoccerMatchStatus.NotStarted;
    }
  }
}
