"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchController = void 0;
const express_1 = __importDefault(require("express"));
const class_transformer_1 = require("class-transformer");
const createMatchRequest_1 = require("./models/requests/createMatchRequest");
const matchQuery_1 = require("./models/matchQuery");
const bson_1 = require("bson");
const router = express_1.default.Router();
const matchController = (matchService) => {
    router.route('/').post(createMatch).get(getMatch);
    router.route('/triggerUpdateMatch').post(triggerUpdateMatch);
    router.route('/:id').get(getMatch);
    async function createMatch(req, res, next) {
        try {
            const matchId = new bson_1.ObjectID().toString();
            const match = class_transformer_1.plainToClass(createMatchRequest_1.CreateMatchRequest, Object.assign(Object.assign({}, req.body), { matchId }));
            const result = await matchService.createMatch(match);
            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function getMatch(req, res, next) {
        try {
            let result = {};
            if (req.params.id) {
                result = await matchService.getMatchById(req.params.id);
            }
            else {
                class_transformer_1.plainToClass(matchQuery_1.MatchQuery, req.params);
                result = Object.assign({}, await matchService.getMatchWithQuery(class_transformer_1.plainToClass(matchQuery_1.MatchQuery, req.params)));
            }
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async function triggerUpdateMatch(req, res, next) {
        try {
            let result = {};
            const { matchId, match, triggeredEvents } = req.body;
            result = await matchService.updateMatchAndTriggeredEventsById(matchId, match, triggeredEvents);
            return res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    return router;
};
exports.matchController = matchController;
//# sourceMappingURL=matchController.js.map