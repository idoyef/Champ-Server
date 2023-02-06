import express, { NextFunction, Request, Response } from 'express';
import { AuthService } from './authService';
import { plainToClass } from 'class-transformer';
import { LoginRequest } from './models/loginRequest';

const router = express.Router();

export const authController = (authService: AuthService) => {
  router.route('/login').post(login);
  router.route('/forgotPassword').post(forgotPassword);

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginRequest = plainToClass(LoginRequest, req.body as LoginRequest);
      const result = await authService.login(loginRequest);
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
