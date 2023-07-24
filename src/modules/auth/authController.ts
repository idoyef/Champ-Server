import express, { NextFunction, Request, Response } from 'express';
import { AuthService } from './authService';

const router = express.Router();

export const authController = (authService: AuthService) => {
  router.route('/login').post(login);
  router.route('/forgotPassword').post(forgotPassword);

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
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
      const result = await authService.forgotPassword();
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
