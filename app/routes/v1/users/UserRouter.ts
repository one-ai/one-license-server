import { Router } from 'express';
import { UserController } from '@controllers';
import { Validator, ValidationSource } from '@helpers';
import { UserValidationSchema } from './UserValidationSchema';

const UserRouter = Router();

// Find all user
UserRouter.get('/', UserController.findAll);

// Find single user
UserRouter.get('/:userId', Validator(UserValidationSchema.userId, ValidationSource.PARAM), UserController.findOne);

// Update user
UserRouter.put('/:userId', Validator(UserValidationSchema.userId, ValidationSource.PARAM), UserController.update);

export { UserRouter };
