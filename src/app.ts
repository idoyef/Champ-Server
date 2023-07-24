import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApiWrapper } from './utils/apiWrapper';
import { tournamentController } from './modules/tournaments/tournamentController';
import { ApiRoute } from './common/enums/apiRoute';
import { TournamentService } from './modules/tournaments/tournamentService';
import { TournamentRepository } from './modules/tournaments/tournamentRepository';
import { MatchRepository } from './modules/matches/matchRepository';
import { MatchService } from './modules/matches/matchService';
import { ApiSoccerProviderMock } from './modules/dataProviders/soccerDataProvider/apiFootballProviderMock';
import { SoccerService } from './modules/sports/soccer/soccerService';
import { SoccerMatchRepository } from './modules/sports/soccer/soccerRepository';
import { SportApiGateway } from './modules/sports/sportApiGateway/sportApiGateway';
import { MatchChallengesRepository } from './modules/matches/matchChallengeRepository';
import { ChallengeRepository } from './modules/matches/challengeRepository';
import { SoccerIdMatchIdMappingRepository } from './modules/sports/soccer/soccerIdMatchIdMappingRepository';
import { EventHandler } from './common/events/eventHandler';
import { matchController } from './modules/matches/matchController';
import { clearIntervals, clearTimeouts } from './utils';
import { soccerController } from './modules/sports/soccer/soccerController';
import { UserRepository } from './modules/users/userRepository';
import { UserService } from './modules/users/userService';
import { AuthService } from './modules/auth/authService';
import { AuthRepository } from './modules/auth/authRepository';
import { userController } from './modules/users/userController';
import { authController } from './modules/auth/authController';
import { handleError } from './utils/errorHandler';
import { CoinRepository } from './modules/coins/coinRepository';
import { CoinService } from './modules/coins/coinService';

export const initApp = () => {
  const options = {
    origin: '*',
    optionSuccessStatus: 200,
  };
  const app = express();
  app.use(cors(options)).use(bodyParser.json());

  const apiWrapper = new ApiWrapper();
  const eventHandler = new EventHandler();

  // auth & user
  const authRepository = new AuthRepository();
  const authService = new AuthService(authRepository);
  const userRepository = new UserRepository();
  const userService = new UserService(authService, userRepository);

  // coins
  const coinRepository = new CoinRepository();
  new CoinService(coinRepository, eventHandler);

  // challenge & challengeMatch
  const challengeRepository = new ChallengeRepository();
  const matchChallengeRepository = new MatchChallengesRepository();
  const matchRepository = new MatchRepository();
  const matchService = new MatchService(
    matchRepository,
    matchChallengeRepository,
    challengeRepository,
    eventHandler
  );

  // tournament
  const tournamentRepository = new TournamentRepository();
  const tournamentService = new TournamentService(
    tournamentRepository,
    matchService,
    eventHandler
  );

  // soccer provider & soccer match
  const soccerProviderMock = new ApiSoccerProviderMock();
  const soccerMatchRepository = new SoccerMatchRepository();
  const soccerIdMatchIdMappingRepository =
    new SoccerIdMatchIdMappingRepository();
  const soccerService = new SoccerService(
    soccerProviderMock,
    soccerMatchRepository,
    soccerIdMatchIdMappingRepository,
    eventHandler
  );

  new SportApiGateway(soccerService);

  app.use(`/${ApiRoute.Users}`, userController(userService));
  app.use(`/${ApiRoute.Auth}`, authController(authService));
  app.use(`/${ApiRoute.Tournaments}`, tournamentController(tournamentService));
  app.use(`/${ApiRoute.Matches}`, matchController(matchService));
  app.use(`/${ApiRoute.Soccer}`, soccerController(soccerService));

  process.on('exit', () => {
    clearIntervals();
    clearTimeouts();
  });
  process.on('SIGINT', () => {
    clearIntervals();
    clearTimeouts();
  });

  process.on('uncaughtException', (error: any) => {
    handleError(error);
  });
  process.on('unhandledRejection', (error: any) => {
    handleError(error);
  });

  app.use((error: any, req: any, res: any, next: any) => {
    const result = handleError(error);
    res.status(result.httpStatus).json(result);
  });

  return app;
};
