import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';
import { SYNC_STRATEGY, SYNC_TRIGGER, LICENSE_TYPE } from '@models';

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
        type: Joi.string().valid(LICENSE_TYPE.NO_OF_API_CALLS, LICENSE_TYPE.TIME_BOUND),
        description: Joi.string().required().min(1),
        metaData: Joi.object().optional(),
        syncStrategy: Joi.string().valid(SYNC_STRATEGY.HTTP, SYNC_STRATEGY.SFTP),
        syncTrigger: Joi.string().valid(SYNC_TRIGGER.AFTER_INTERVAL, SYNC_TRIGGER.AT_EVERY_CALL),
        // (dot) for self reference: https://github.com/hapijs/joi/issues/1569#issuecomment-437713596
        syncInterval: Joi.when('syncTrigger', {
            is: SYNC_TRIGGER.AFTER_INTERVAL,
            then: Joi.number().required(),
        }),
        allowedApiCalls: Joi.when('type', {
            is: LICENSE_TYPE.NO_OF_API_CALLS,
            then: Joi.number().required(),
        }),
        expiresAt: Joi.when('type', {
            is: LICENSE_TYPE.TIME_BOUND,
            then: Joi.date().required(),
        }),
    }),
};
