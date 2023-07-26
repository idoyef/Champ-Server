import { AuthService } from '../auth/authService';
import { CoinService } from '../coins/coinService';
import { TournamentService } from '../tournaments/tournamentService';
import { UserService } from '../users/userService';
import { LoginRequest } from './models/loginRequest';

const sectionName = 'UsersBffService';

export class UserBffService {
  constructor(
    private authService: AuthService, // remove when switching to micro services
    private userService: UserService, // remove when switching to micro services
    private coinService: CoinService, // remove when switching to micro services
    private tournamentService: TournamentService // remove when switching to micro services
  ) {}

  async login(loginRequest: LoginRequest) {
    return await this.authService.login(loginRequest);
  }

  async forgotPassword() {
    return await this.authService.forgotPassword();
  }

  async me(userId: string) {
    const [userData, coins, tournaments] = await Promise.all([
      this.userService.getUserById(userId),
      this.coinService.getCoinsByUserId(userId),
      this.tournamentService.getUserTournamentsByUserId(userId),
    ]);

    return { userData, coins, tournaments };
  }
}
