import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { APIRouter } from './routes';

// Initialize database
import '@models';

import { MongoSeeder } from '@helpers';
import { CustomError } from '@core';
import { ErrorHandler } from '@core';
import { ERROR_CODES } from '@config';

// Seed roles
MongoSeeder();

// Init express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', APIRouter);

// Serve any static files
app.use(express.static(path.join(__dirname, 'public')));

// Invalid endpoint
app.use(() => {
    throw new CustomError(ERROR_CODES.ENDPOINT_NOT_FOUND);
});

// Print API errors
app.use((err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
    new ErrorHandler(err, req, res);
});

// Export express instance
export { app };
