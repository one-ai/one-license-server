import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';
import { syncStrategy, syncTrigger, licenseType } from '@models';

export const LicenseValidationSchema = {
    allLicenses: Joi.object().keys({
        productId: JoiObjectId().required(),
        versionId: JoiObjectId().required(),
    }),
    singleLicense: Joi.object().keys({
        productId: JoiObjectId().required(),
        versionId: JoiObjectId().required(),
        licenseId: JoiObjectId().required(),
    }),
    licenseId: Joi.object().keys({
        licenseId: JoiObjectId().required(),
    }),
    versionId: Joi.object().keys({
        versionId: JoiObjectId().required(),
    }),
    productId: Joi.object().keys({
        productId: JoiObjectId().required(),
    }),
    licenseCreateOrUpdate: Joi.object().keys({
        type: Joi.string().valid(licenseType.NO_OF_API_CALLS, licenseType.TIME_BOUND),
        description: Joi.string().required().min(1),
        metaData: Joi.object().optional(),
        syncStrategy: Joi.string().valid(syncStrategy.HTTP, syncStrategy.SFTP),
        syncTrigger: Joi.string().valid(syncTrigger.AFTER_INTERVAL, syncTrigger.AT_EVERY_CALL),
        // (dot) for self reference: https://github.com/hapijs/joi/issues/1569#issuecomment-437713596
        syncInterval: Joi.number().when('.syncInterval', {
            is: syncTrigger.AFTER_INTERVAL,
            then: Joi.number().required(),
        }),
        allowedApiCalls: Joi.number().when('.allowedApiCalls', {
            is: licenseType.NO_OF_API_CALLS,
            then: Joi.number().required(),
        }),
        expiresAt: Joi.date().when('.expiresAt', {
            is: licenseType.TIME_BOUND,
            then: Joi.date().required(),
        }),
    }),
};
