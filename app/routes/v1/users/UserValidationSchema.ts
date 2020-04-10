import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';

export const UserValidationSchema = {
    userId: Joi.object().keys({
        userId: JoiObjectId().required(),
    }),
    userUpdate: Joi.object().keys({
        firstName: Joi.string().optional().min(3),
        lastName: Joi.string().optional().min(1),
        email: Joi.string().optional().email(),
        password: Joi.string().optional().min(8),
        oldPassword: Joi.string().optional().min(8),
    }),
};
