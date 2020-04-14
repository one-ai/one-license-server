import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';

export const ProductValidationSchema = {
    productId: Joi.object().keys({
        productId: JoiObjectId().required(),
    }),
    productCreateOrUpdate: Joi.object().keys({
        name: Joi.string().optional().min(3),
        description: Joi.string().optional().min(1),
        metaData: Joi.object().optional(),
    }),
};
