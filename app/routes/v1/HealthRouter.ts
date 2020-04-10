import { Request, Response, Router } from 'express';
import { SuccessHandler } from '@core';

// Init shared
const HealthRouter = Router();

HealthRouter.get('/', (req: Request, res: Response): void => {
    new SuccessHandler('Server is alive :D', res);
});

export { HealthRouter };
