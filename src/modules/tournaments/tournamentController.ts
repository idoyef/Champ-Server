import express, { NextFunction, Request, Response } from 'express';
import { TournamentService } from './tournamentService';

const router = express.Router();

export const tournamentController = (tournamentService: TournamentService) => {
  router.route('/').post(createTournament).get(getTournament);
  router.route('/:id').get(getTournament);

  async function createTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await tournamentService.createTournament(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function getTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let result = {};

      if (req.params.id) {
        result = await tournamentService.getTournamentById(req.params.id);
      } else {
        // TBD - validate params
        result = await tournamentService.getTournamentWithQuery(
          req.params as any
        );
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
