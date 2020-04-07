import { Response } from 'express';

export default class SuccessHandler<T> {
    constructor(data: T, res: Response) {
        res.status(200).json(data);
    }
}
