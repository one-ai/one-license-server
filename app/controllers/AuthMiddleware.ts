import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '@services';
import { CustomError } from '@core';
import { ERROR_CODES } from '@config';

const AuthMiddleware = Router();

AuthMiddleware.use(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    if (!token) throw new CustomError(ERROR_CODES.TOKEN_NOT_FOUND);
    const strippedToken = token.split(' ')[1];
    req.currentUser = await AuthService.getUserFromToken(strippedToken);
    next();
});

export { AuthMiddleware };
