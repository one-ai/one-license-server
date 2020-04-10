import { Response } from 'express';

export class SuccessHandler<T> {
    constructor(data: T, res: Response) {
        res.status(200).json(data);
    }
}
