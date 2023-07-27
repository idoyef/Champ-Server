import { SportType } from './common/enums/sportType';
import { CoinService } from './modules/coins/coinService';
import { ChallengeType } from './modules/matches/enums/ChallengeType';
import { WinLossResultOptions } from './modules/matches/enums/winLossResultOptions';
import { WinLossChallengeResult } from './modules/matches/models/challengeResults/winLossChallengeResult';
import { MatchStatus } from './modules/sports/soccer/enums/matchStatus';
import { SoccerService } from './modules/sports/soccer/soccerService';
import { TournamentType } from './modules/tournaments/enums/TournamentType';
import { CreateTournamentRequest } from './modules/tournaments/models/requests/createTournamentRequest';
import { TournamentService } from './modules/tournaments/tournamentService';
import { Role } from './modules/users/enums/role';
import { UserState } from './modules/users/enums/userState';
import { UserService } from './modules/users/userService';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_NUMBER_OF_COINS = 100;
const users = [
  {
    username: 'ido',
    email: 'ido@gmail.com',
    role: Role.User,
    state: UserState.Active,
  },
  {
    username: 'or',
    email: 'or@gmail.com',
    role: Role.User,
    state: UserState.Active,
  },
];

export class Seed {
  constructor(
    private userService: UserService,
    private coinService: CoinService,
    private soccerService: SoccerService,
    private tournamentService: TournamentService
  ) {}

  async init() {
    try {
      const dbUsers = await Promise.all(
        users.map((user) => this.userService.createUser(user))
      );
      const userIds = dbUsers.map(({ id }) => id);
      await Promise.all(
        userIds.map((id) =>
          this.coinService.addCoins(id, DEFAULT_NUMBER_OF_COINS)
        )
      );

      await sleep(5000);

      const matches = await this.soccerService.findMatchesWithQuery({
        matchStatus: MatchStatus.NotStarted,
      });
      const matchIds = matches.map(({ id }) => id);

      await this.tournamentService.createTournament(
        getTournamentBody(matchIds, userIds)
      );
    } catch (error) {
      console.log('Failed to seed app', { error });
    }
  }
}

const getTournamentBody = (
  matchIds: string[],
  participantIds: string[]
): CreateTournamentRequest => ({
  type: TournamentType.FirstToReachScore,
  participantIds,
  matchChallenges: [
    {
      matchId: matchIds[0],
      matchType: SportType.Soccer,
      challenges: [
        {
          type: ChallengeType.WinLoss,
          participantsGuess: {
            [participantIds[0]]: {
              matchWinner: WinLossResultOptions.Home,
            } as WinLossChallengeResult,
            [participantIds[1]]: {
              matchWinner: WinLossResultOptions.Away,
            } as WinLossChallengeResult,
          },
          score: 10,
        },
      ],
    },
    {
      matchId: matchIds[1],
      matchType: SportType.Soccer,
      challenges: [
        {
          type: ChallengeType.WinLoss,
          participantsGuess: {
            [participantIds[0]]: {
              matchWinner: WinLossResultOptions.Away,
            } as WinLossChallengeResult,
            [participantIds[1]]: {
              matchWinner: WinLossResultOptions.Home,
            } as WinLossChallengeResult,
          },
          score: 20,
        },
      ],
    },
  ],
  completionScore: 20,
  bet: 50,
});
