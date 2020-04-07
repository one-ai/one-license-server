import { Request, Response, Router } from 'express';
import SuccessHandler from '@shared/SuccessHandler';

// Init shared
const router = Router();

router.get('/all', async (req: Request, res: Response) => {
    return new SuccessHandler('works', res);
});

export default router;
