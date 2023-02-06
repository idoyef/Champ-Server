import express, { NextFunction, Request, Response } from 'express';
import { SoccerService } from './soccerService';

const router = express.Router();

export const soccerController = (soccerService: SoccerService) => {
  // router.route('/').post(createSoccerMatch);
  // router.route('/:id').patch(updateSoccerMatch);

  // async function createSoccerMatch(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const result = await soccerService.createSoccerMatch(req.body);
  //     return res.status(201).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async function updateSoccerMatch(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const result = await soccerService.updateSoccerMatch(
  //       req.params.id,
  //       req.body
  //     );
  //     return res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  return router;
};
