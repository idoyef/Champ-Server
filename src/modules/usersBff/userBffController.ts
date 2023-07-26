import express, { NextFunction, Request, Response } from 'express';
import { UserBffService } from './userBffService';

const router = express.Router();

export const UserBffController = (userBffService: UserBffService) => {
  router.route('/me').get(me);
  router.route('/login').post(login);
  router.route('/forgotPassword').post(forgotPassword);

  async function me(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userBffService.me(req.query.userId as string);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userBffService.login(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await userBffService.forgotPassword();
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
