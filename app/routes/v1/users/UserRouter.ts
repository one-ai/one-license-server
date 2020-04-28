import { Router } from 'express';
import { UserController, AuthMiddleware } from '@controllers';
import { Validator, ValidationSource } from '@helpers';
import { UserValidationSchema } from './UserValidationSchema';

const UserRouter = Router();

// Find all user
UserRouter.get('/', AuthMiddleware, UserController.findAll);

// Find single user
UserRouter.get(
    '/:userId',
    AuthMiddleware,
    Validator(UserValidationSchema.userId, ValidationSource.PARAM),
    UserController.findOne,
);

// Update user
UserRouter.put(
    '/:userId',
    AuthMiddleware,
    Validator(UserValidationSchema.userId, ValidationSource.PARAM),
    Validator(UserValidationSchema.userUpdate),
    UserController.update,
);

export { UserRouter };
