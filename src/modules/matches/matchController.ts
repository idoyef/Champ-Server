import express, { NextFunction, Request, Response } from 'express';
import { MatchService } from './matchService';
import { ObjectID } from 'bson';

const router = express.Router();

export const matchController = (matchService: MatchService) => {
  router.route('/:id').get(getMatch);

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

  return router;
};
