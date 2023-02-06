import express, { NextFunction, Request, Response } from 'express';
import { TournamentService } from './tournamentService';
import { plainToClass } from 'class-transformer';
import { TournamentQuery } from './models/tournamentQuery';
import { CreateTournamentRequest } from './models/requests/createTournamentRequest';
import { UpdateTournamentRequest } from './models/requests/updateTournamentRequest';

const router = express.Router();

export const tournamentController = (tournamentService: TournamentService) => {
  router
    .route('/')
    .post(createTournament)
    .get(getTournament)
    .patch(updateTournament);
  router.route('/:id').get(getTournament);

  async function createTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tournament = plainToClass(
        CreateTournamentRequest,
        req.body as CreateTournamentRequest
      );
      const result = await tournamentService.createTournament(tournament);
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
        plainToClass(TournamentQuery, req.params);
        result = Object.assign(
          {},
          await tournamentService.getTournamentWithQuery(
            plainToClass(TournamentQuery, req.params) as TournamentQuery
          )
        );
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async function updateTournament(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let result = {};

      if (req.params.id) {
        const tournament = plainToClass(
          UpdateTournamentRequest,
          req.body as UpdateTournamentRequest
        );
        result = await tournamentService.updateTournamentById(tournament);
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
