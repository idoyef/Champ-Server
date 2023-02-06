import express, { NextFunction, Request, Response } from 'express';
import { UserService } from './userService';
import { plainToClass } from 'class-transformer';
import { DbUser } from './models/dbUser';
import { UserQuery } from './models/userQuery';
import { SignUpRequest } from '../auth/models/signUpRequest';

const router = express.Router();

export const userController = (usersService: UserService) => {
  router.route('/signup').post(signUp);
  router.route('/isUsernameExists/:username').get(isUsernameExists);
  router.route('/isEmailExists/:email').get(isEmailExists);
  router.route('/').get(getUser);
  router.route('/:id').get(getUser);

  async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpRequest = plainToClass(SignUpRequest, req.body as DbUser);
      const result = await usersService.signUp(signUpRequest);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function isUsernameExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await usersService.isUsernameExists(req.params.username);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function isEmailExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await usersService.isEmailExists(req.params.email);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
      let result = {};

      if (req.params.id) {
        result = await usersService.getUserById(req.params.id);
      } else {
        plainToClass(UserQuery, req.params);
        result = await usersService.getUserWithQuery(
          plainToClass(UserQuery, req.params) as UserQuery
        );
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
