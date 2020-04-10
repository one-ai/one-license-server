import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';

export const UserValidationSchema = {
    userId: Joi.object().keys({
        userId: JoiObjectId().required(),
    }),
};
