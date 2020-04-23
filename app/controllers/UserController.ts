import { Request, Response } from 'express';
import { SuccessHandler, CustomError } from '@core';
import { UserService } from '@services';
import { User } from '@models';
import { ERROR_CODES } from '@config';

export const UserController = {
    findOne: async function (req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const user: User | null = await UserService.findOne({ _id: userId } as User);
        if (!user) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(user, res);
    },
    findAll: async function (req: Request, res: Response): Promise<void> {
        const users: User[] = await UserService.findAll();
        new SuccessHandler(users, res);
    },
    update: async function (req: Request, res: Response): Promise<void> {
        const newUserInfo = req.body;
        const oldPassword: string | undefined = req.body.oldPassword;
        newUserInfo._id = req.params.userId;
        const users: User | User[] = await UserService.update(newUserInfo, oldPassword);
        new SuccessHandler(users, res);
    },
};
