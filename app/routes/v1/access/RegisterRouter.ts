import { Router } from 'express';
import { AccessController } from '@controllers';
import { Validator } from '@helpers';
import { RegisterValidationSchema } from './ValidationSchema';

const RegisterRouter = Router();

RegisterRouter.post('/basic', Validator(RegisterValidationSchema.register), AccessController.register);

export { RegisterRouter };
