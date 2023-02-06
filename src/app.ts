import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { UserService } from './modules/users/userService';
import { userController } from './modules/users/userController';
import { authController } from './modules/auth/authController';
import { AuthService } from './modules/auth/authService';
import { verifyToken } from './utils/tokenHandler';
import { handleError } from './utils/errorHandler';
import { ApiFootballProvider } from './modules/dataProviders/soccer/apiFootballProvider';
import { SoccerService } from './modules/sports/soccer/soccerService';
import { MatchService } from './modules/matches/matchService';
import { ApiWrapper } from './utils/apiWrapper';
import { AgendaWrapper } from './utils/scheduler/agendaWrapper';
import { MetadataService } from './modules/metadata/metadataService';
import { soccerController } from './modules/sports/soccer/soccerController';
import { TournamentService } from './modules/tournaments/tournamentService';
import { tournamentController } from './modules/tournaments/tournamentController';
import { ChallengeService } from './modules/challenges/challengeService';
import { SoccerChallengeService } from './modules/challenges/soccerChallengeService';
import { BasketballChallengeService } from './modules/challenges/basketballChallengeService';
import { MatchChallengeService } from './modules/matchChallenges/matchChallengeService';
import { matchController } from './modules/matches/matchController';
import { ApiRoute } from './common/enums/apiRoute';
import { UserRepository } from './modules/users/userRepository';
import { AuthRepository } from './modules/auth/authRepository';
import { MetadataRepository } from './modules/metadata/metadataRepository';
import { MatchRepository } from './modules/matches/matchRepository';
import { ChallengeRepository } from './modules/challenges/challengeRepository';
import { TournamentRepository } from './modules/tournaments/tournamentRepository';
import { MatchChallengeRepository } from './modules/matchChallenges/matchChallengeRepository';
import { SoccerRepository } from './modules/sports/soccer/soccerRepository';

export const initApp = () => {
  const options = {
    origin: '*',
    optionSuccessStatus: 200,
  };
  const app = express();
  app.use(cors(options)).use(bodyParser.json());

  const scheduler = new AgendaWrapper();
  const apiWrapper = new ApiWrapper();

  const authRepository = new AuthRepository();
  const authService = new AuthService(authRepository);
  app.use(`/${ApiRoute.Auth}`, authController(authService));

  const userRepository = new UserRepository();
  const userService = new UserService(authService, userRepository);
  app.use(`/${ApiRoute.Users}`, /*verifyToken,*/ userController(userService));

  const metadataRepository = new MetadataRepository();
  const metadataService = new MetadataService(metadataRepository);

  const matchRepository = new MatchRepository();
  const matchService = new MatchService(matchRepository);

  // for debugging purposes, consider removing in the future
  app.use(`/${ApiRoute.Matches}`, matchController(matchService));

  const challengeRepository = new ChallengeRepository();
  const challengeService = new ChallengeService(
    challengeRepository,
    new SoccerChallengeService(),
    new BasketballChallengeService()
  );

  const matchChallengeRepository = new MatchChallengeRepository();
  const matchChallengeService = new MatchChallengeService(
    matchChallengeRepository,
    challengeService
  );

  const tournamentRepository = new TournamentRepository();
  const tournamentService = new TournamentService(
    tournamentRepository,
    matchService,
    matchChallengeService,
    challengeService
  );
  app.use(`/${ApiRoute.Tournaments}`, tournamentController(tournamentService));

  const dataSourceProvider = new ApiFootballProvider(apiWrapper);
  const soccerRepository = new SoccerRepository();
  const soccerService = new SoccerService(
    dataSourceProvider,
    soccerRepository,
    matchService,
    scheduler
  );
  app.use(`/${ApiRoute.Soccer}`, soccerController(soccerService));

  process.on('uncaughtException', (error: any) => {
    handleError(error);
  });
  process.on('unhandledRejection', (error: any) => {
    handleError(error);
  });
  process.on('SIGTERM', scheduler.stop);
  process.on('SIGINT', scheduler.stop);

  app.use((error: any, req: any, res: any, next: any) => {
    const result = handleError(error);
    res.status(result.httpStatus).json(result);
  });

  return app;
};
