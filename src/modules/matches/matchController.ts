import express, { NextFunction, Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { MatchService } from './matchService';
import { CreateMatchRequest } from './models/requests/createMatchRequest';
import { MatchQuery } from './models/matchQuery';
import { ObjectID } from 'bson';

const router = express.Router();

export const matchController = (matchService: MatchService) => {
  router.route('/').post(createMatch).get(getMatch);
  router.route('/triggerUpdateMatch').post(triggerUpdateMatch);
  router.route('/:id').get(getMatch);

  async function createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = new ObjectID().toString();
      const match = plainToClass(CreateMatchRequest, {
        ...req.body,
        matchId,
      } as CreateMatchRequest);
      const result = await matchService.createMatch(match);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function getMatch(req: Request, res: Response, next: NextFunction) {
    try {
      let result = {};

      if (req.params.id) {
        result = await matchService.getMatchById(req.params.id);
      } else {
        plainToClass(MatchQuery, req.params);
        result = Object.assign(
          {},
          await matchService.getMatchWithQuery(
            plainToClass(MatchQuery, req.params) as MatchQuery
          )
        );
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async function triggerUpdateMatch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let result = {};

      const { matchId, match, triggeredEvents } = req.body;

      result = await matchService.updateMatchAndTriggeredEventsById(
        matchId,
        match,
        triggeredEvents
      );

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
