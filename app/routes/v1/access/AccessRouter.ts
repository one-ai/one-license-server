import { Router } from 'express';
import { AccessController } from '@controllers';
import { Validator } from '@helpers';
import { AccessValidationSchema } from './AccessValidationSchema';

const AccessRouter = Router();

AccessRouter.post('/register/basic', Validator(AccessValidationSchema.register), AccessController.register);
AccessRouter.post('/login/basic', Validator(AccessValidationSchema.login), AccessController.login);

export { AccessRouter };
