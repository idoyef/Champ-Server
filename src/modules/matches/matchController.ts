import express, { NextFunction, Request, Response } from 'express';
import { MatchService } from './matchService';
import { ObjectID } from 'bson';

const router = express.Router();

export const matchController = (matchService: MatchService) => {
  router.route('/').post(createMatch).get(getMatch);
  // router.route('/triggerUpdateMatch').post(triggerUpdateMatch);
  router.route('/:id').get(getMatch);

  async function createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = new ObjectID().toString();
      const match = {
        ...req.body,
        matchId,
      };
      const result = await matchService.createMatch(match);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function getMatch(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.params.id) {
        const result = await matchService.getMatchById(req.params.id);
        return res.json(result);
      } else {
        const result = await matchService.getMatchWithQuery(req.params);
        return res.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  // async function triggerUpdateMatch(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     let result = {};

  //     const { matchId, match, triggeredEvents } = req.body;

  //     result = await matchService.updateMatchAndTriggeredEventsById(
  //       matchId,
  //       match,
  //       triggeredEvents
  //     );

  //     return res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  return router;
};
