import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';

export const VersionValidationSchema = {
    singleVersion: Joi.object().keys({
        productId: JoiObjectId().required(),
        versionId: JoiObjectId().required(),
    }),
    productId: Joi.object().keys({
        productId: JoiObjectId().required(),
    }),
    versionId: Joi.object().keys({
        versionId: JoiObjectId().required(),
    }),
    versionCreateOrUpdate: Joi.object().keys({
        name: Joi.string().optional().min(1),
        description: Joi.string().optional().min(1),
        metaData: Joi.object().optional(),
    }),
};
