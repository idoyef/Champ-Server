"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userService_1 = require("./modules/users/userService");
const userController_1 = require("./modules/users/userController");
const authController_1 = require("./modules/auth/authController");
const authService_1 = require("./modules/auth/authService");
const errorHandler_1 = require("./utils/errorHandler");
const apiFootballProvider_1 = require("./modules/dataProviders/soccer/apiFootballProvider");
const soccerService_1 = require("./modules/sports/soccer/soccerService");
const matchService_1 = require("./modules/matches/matchService");
const apiWrapper_1 = require("./utils/apiWrapper");
const agendaWrapper_1 = require("./utils/scheduler/agendaWrapper");
const metadataService_1 = require("./modules/metadata/metadataService");
const soccerController_1 = require("./modules/sports/soccer/soccerController");
const tournamentService_1 = require("./modules/tournaments/tournamentService");
const tournamentController_1 = require("./modules/tournaments/tournamentController");
const challengeService_1 = require("./modules/challenges/challengeService");
const soccerChallengeService_1 = require("./modules/challenges/soccerChallengeService");
const basketballChallengeService_1 = require("./modules/challenges/basketballChallengeService");
const matchChallengeService_1 = require("./modules/matchChallenges/matchChallengeService");
const matchController_1 = require("./modules/matches/matchController");
const apiRoute_1 = require("./common/enums/apiRoute");
const userRepository_1 = require("./modules/users/userRepository");
const authRepository_1 = require("./modules/auth/authRepository");
const metadataRepository_1 = require("./modules/metadata/metadataRepository");
const matchRepository_1 = require("./modules/matches/matchRepository");
const challengeRepository_1 = require("./modules/challenges/challengeRepository");
const tournamentRepository_1 = require("./modules/tournaments/tournamentRepository");
const matchChallengeRepository_1 = require("./modules/matchChallenges/matchChallengeRepository");
const soccerRepository_1 = require("./modules/sports/soccer/soccerRepository");
const initApp = () => {
    const options = {
        origin: '*',
        optionSuccessStatus: 200,
    };
    const app = express_1.default();
    app.use(cors_1.default(options)).use(body_parser_1.default.json());
    const scheduler = new agendaWrapper_1.AgendaWrapper();
    const apiWrapper = new apiWrapper_1.ApiWrapper();
    const authRepository = new authRepository_1.AuthRepository();
    const authService = new authService_1.AuthService(authRepository);
    app.use(`/${apiRoute_1.ApiRoute.Auth}`, authController_1.authController(authService));
    const userRepository = new userRepository_1.UserRepository();
    const userService = new userService_1.UserService(authService, userRepository);
    app.use(`/${apiRoute_1.ApiRoute.Users}`, /*verifyToken,*/ userController_1.userController(userService));
    const metadataRepository = new metadataRepository_1.MetadataRepository();
    const metadataService = new metadataService_1.MetadataService(metadataRepository);
    const matchRepository = new matchRepository_1.MatchRepository();
    const matchService = new matchService_1.MatchService(matchRepository);
    // for debugging purposes, consider removing in the future
    app.use(`/${apiRoute_1.ApiRoute.Matches}`, matchController_1.matchController(matchService));
    const challengeRepository = new challengeRepository_1.ChallengeRepository();
    const challengeService = new challengeService_1.ChallengeService(challengeRepository, new soccerChallengeService_1.SoccerChallengeService(), new basketballChallengeService_1.BasketballChallengeService());
    const matchChallengeRepository = new matchChallengeRepository_1.MatchChallengeRepository();
    const matchChallengeService = new matchChallengeService_1.MatchChallengeService(matchChallengeRepository, challengeService);
    const tournamentRepository = new tournamentRepository_1.TournamentRepository();
    const tournamentService = new tournamentService_1.TournamentService(tournamentRepository, matchService, matchChallengeService, challengeService);
    app.use(`/${apiRoute_1.ApiRoute.Tournaments}`, tournamentController_1.tournamentController(tournamentService));
    const dataSourceProvider = new apiFootballProvider_1.ApiFootballProvider(apiWrapper);
    const soccerRepository = new soccerRepository_1.SoccerRepository();
    const soccerService = new soccerService_1.SoccerService(dataSourceProvider, soccerRepository, matchService, scheduler);
    app.use(`/${apiRoute_1.ApiRoute.Soccer}`, soccerController_1.soccerController(soccerService));
    process.on('uncaughtException', (error) => {
        errorHandler_1.handleError(error);
    });
    process.on('unhandledRejection', (error) => {
        errorHandler_1.handleError(error);
    });
    process.on('SIGTERM', scheduler.stop);
    process.on('SIGINT', scheduler.stop);
    app.use((error, req, res, next) => {
        const result = errorHandler_1.handleError(error);
        res.status(result.httpStatus).json(result);
    });
    return app;
};
exports.initApp = initApp;
//# sourceMappingURL=app.js.map