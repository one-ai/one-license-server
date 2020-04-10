import Joi from '@hapi/joi';

export const AccessValidationSchema = {
    register: Joi.object().keys({
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(1),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
    login: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
};
