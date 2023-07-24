import express, { NextFunction, Request, Response } from 'express';
import { UserService } from './userService';

const router = express.Router();

export const userController = (usersService: UserService) => {
  router.route('/signup').post(signUp);
  router.route('/isUsernameExists/:username').get(isUsernameExists);
  router.route('/isEmailExists/:email').get(isEmailExists);
  router.route('/').get(getUser);
  router.route('/:id').get(getUser);

  async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await usersService.signUp(req.body);
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
        result = await usersService.getUserWithQuery(req.params);
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  return router;
};
