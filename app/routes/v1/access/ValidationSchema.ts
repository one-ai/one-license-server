import Joi from '@hapi/joi';

export const RegisterValidationSchema = {
    register: Joi.object().keys({
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(1),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
};
