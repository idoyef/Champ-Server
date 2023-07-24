import express, { NextFunction, Request, Response } from 'express';
import { SportBffService } from './sportBffService';

const router = express.Router();

export const SportBffController = (sportBffService: SportBffService) => {
  router.route('/').get(getMatch);

  async function getMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await sportBffService.getMatchesWithQuery(req.params);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
