import express, { NextFunction, Request, Response } from 'express';
import { SoccerService } from './soccerService';

const router = express.Router();

export const soccerController = (soccerService: SoccerService) => {
  router.route('/:id').get(getSoccerMatch);
  router.route('/').get(getSoccerMatch);

  async function getSoccerMatch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.query.id) {
        const result = await soccerService.findMatchById(
          req.query.id as string
        );
        return res.json(result);
      } else {
        const date = req.query.date
          ? new Date(new Date(req.query.date as string).setHours(0, 0, 0, 0))
          : undefined;
        const result = await soccerService.findMatchesWithQuery({
          ...req.query,
          date,
        });
        return res.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  return router;
};
