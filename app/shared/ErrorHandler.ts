import CustomError from './CustomError';
import { Response, Request } from 'express';
import { ERROR_CODES, ERRORS } from '@config/ErrorCodes';
import logger from './Logger';
const serviceName = 'one-license-server';

export class ErrorHandler extends Error {
    constructor(err: CustomError | Error, req: Request, res: Response) {
        super();

        // Get debug requirement
        const DEBUG: boolean = req.query.DEBUG ? true : false;

        if (err instanceof CustomError) {
            const customError = ERRORS[err.errorCode];

            // When custom error is thrown
            res.status(customError.status).json({
                errors: [
                    {
                        ...customError,
                    },
                ],
                service: serviceName,
                debug: DEBUG,
                request: DEBUG
                    ? {
                          headers: req.headers,
                          query: req.query,
                          params: req.params,
                          body: req.body,
                          baseUrl: req.baseUrl,
                          originalUrl: req.originalUrl,
                          cookies: req.cookies,
                          ip: req.ip,
                      }
                    : undefined,
            });
        } else {
            // When default Error is thrown

            logger.error(err.message, err);

            const customError = ERRORS[ERROR_CODES.INTERNAL_ERROR];
            res.status(customError.status).json({
                errors: [
                    {
                        ...customError,
                    },
                ],
                code: ERROR_CODES.INTERNAL_ERROR,
                service: serviceName,
                debug: DEBUG,
                request: DEBUG
                    ? {
                          headers: req.headers,
                          query: req.query,
                          params: req.params,
                          body: req.body,
                          baseUrl: req.baseUrl,
                          originalUrl: req.originalUrl,
                          cookies: req.cookies,
                          ip: req.ip,
                      }
                    : undefined,
            });
        }
    }
}
