import { sign, decode, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException, ErrorReason } from './errorHandler';

export const generateToken = (payload: object): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  return sign(payload, jwtSecret);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader === 'undefined') {
    throw new UnauthorizedException(
      new ErrorReason('Invalid Token', 'Token is invalid')
    );
  }

  const jwtSecret = process.env.JWT_SECRET as string;

  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  if (!token) {
    throw new UnauthorizedException(
      new ErrorReason('Invalid Token', 'Token is invalid')
    );
  }

  verify(token, jwtSecret, (err: any, payload: any) => {
    if (err) {
      throw new UnauthorizedException(
        new ErrorReason('Invalid Token', 'Token is invalid')
      );
    }

    // req.userInfo = payload;
    next();
  });
};
