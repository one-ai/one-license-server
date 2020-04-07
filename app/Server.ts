import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import BaseRouter from './routes';

import './models'; // Initialize database
import CustomError from '@shared/CustomError';
import { ErrorHandler } from '@shared/ErrorHandler';
import { ERROR_CODES } from '@config/ErrorCodes';

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
app.use('/api', BaseRouter);

// Invalid endpoint
app.use(() => {
    throw new CustomError(ERROR_CODES.ENDPOINT_NOT_FOUND);
});

// Print API errors
app.use((err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
    new ErrorHandler(err, req, res);
    next();
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// Export express instance
export default app;
