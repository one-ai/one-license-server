import { Request, Response } from 'express';
import { SuccessHandler } from '@core';
import { UserService } from '@services';
import { User } from '@models';

export const AccessController = {
    register: async function (req: Request, res: Response): Promise<void> {
        const body: Pick<User, 'firstName' | 'lastName' | 'email' | 'password'> & User = req.body;
        const user: User = await UserService.create(body);
        new SuccessHandler(user, res);
    },
};
