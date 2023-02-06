"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentController = void 0;
const express_1 = __importDefault(require("express"));
const class_transformer_1 = require("class-transformer");
const tournamentQuery_1 = require("./models/tournamentQuery");
const createTournamentRequest_1 = require("./models/requests/createTournamentRequest");
const updateTournamentRequest_1 = require("./models/requests/updateTournamentRequest");
const router = express_1.default.Router();
const tournamentController = (tournamentService) => {
    router
        .route('/')
        .post(createTournament)
        .get(getTournament)
        .patch(updateTournament);
    router.route('/:id').get(getTournament);
    async function createTournament(req, res, next) {
        try {
            const tournament = (0, class_transformer_1.plainToClass)(createTournamentRequest_1.CreateTournamentRequest, req.body);
            const result = await tournamentService.createTournament(tournament);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function getTournament(req, res, next) {
        try {
            let result = {};
            if (req.params.id) {
                result = await tournamentService.getTournamentById(req.params.id);
            }
            else {
                (0, class_transformer_1.plainToClass)(tournamentQuery_1.TournamentQuery, req.params);
                result = Object.assign({}, await tournamentService.getTournamentWithQuery((0, class_transformer_1.plainToClass)(tournamentQuery_1.TournamentQuery, req.params)));
            }
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function updateTournament(req, res, next) {
        try {
            let result = {};
            if (req.params.id) {
                const tournament = (0, class_transformer_1.plainToClass)(updateTournamentRequest_1.UpdateTournamentRequest, req.body);
                result = await tournamentService.updateTournamentById(tournament);
            }
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    return router;
};
exports.tournamentController = tournamentController;
//# sourceMappingURL=tournamentController.js.map