import { Request, Response, Router } from 'express';
import SuccessHandler from '@core/SuccessHandler';

// Init shared
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    return new SuccessHandler('Server is alive :D', res);
});

export default router;
