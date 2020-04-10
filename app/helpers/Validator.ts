import Joi from '@hapi/joi';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export enum ValidationSource {
    BODY = 'body',
    HEADER = 'headers',
    QUERY = 'query',
    PARAM = 'params',
}

export function Validator(schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req[source]);

        if (!error) return next();

        const { details } = error;
        //const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');

        throw new CustomError(ERROR_CODES.INSUFFICIENT_PARAMETERS);
    };
}

export const JoiObjectId = () =>
    Joi.string().custom((value: string, helpers) => {
        if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
        return value;
    }, 'Object Id Validation');
