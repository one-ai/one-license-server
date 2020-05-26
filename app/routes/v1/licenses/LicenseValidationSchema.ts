import Joi from '@hapi/joi';
import { JoiObjectId } from '@helpers';
import { SYNC_STRATEGY, SYNC_TRIGGER, LICENSE_TYPE, CLIENT_TYPE } from '@models';

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
    consume: Joi.object().keys({
        clientType: Joi.string().required().valid(CLIENT_TYPE.INDEPENDENT_CLIENT, CLIENT_TYPE.THIN_CLIENT),
        clientConnectionId: Joi.when('clientType', {
            is: CLIENT_TYPE.THIN_CLIENT,
            then: Joi.number().required(),
        }),
        clientIdentifier: Joi.when('clientType', {
            is: CLIENT_TYPE.THIN_CLIENT,
            then: Joi.number().required(),
        }),
        apiCallCounter: Joi.when('clientType', {
            is: CLIENT_TYPE.THIN_CLIENT,
            then: Joi.number().required(),
        }),
    }),
    licenseCreateOrUpdate: Joi.object().keys({
        name: Joi.string().required().min(1),
        type: Joi.string().valid(
            LICENSE_TYPE.NO_OF_API_CALLS,
            LICENSE_TYPE.TIME_BOUND,
            LICENSE_TYPE.TIME_BOUND_AND_API_CALLS,
        ),
        clientType: Joi.string().valid(CLIENT_TYPE.INDEPENDENT_CLIENT, CLIENT_TYPE.THIN_CLIENT),
        activationDelay: Joi.number().required().min(0),
        description: Joi.string().required().min(1),
        metaData: Joi.object().optional(),
        syncStrategy: Joi.string().valid(SYNC_STRATEGY.HTTP, SYNC_STRATEGY.SFTP),
        syncTrigger: Joi.string().valid(SYNC_TRIGGER.AFTER_INTERVAL, SYNC_TRIGGER.AT_EVERY_CALL),
        syncInterval: Joi.when('syncTrigger', {
            is: SYNC_TRIGGER.AFTER_INTERVAL,
            then: Joi.number().required(),
        }),
        allowedApiCalls: Joi.when('type', {
            is: LICENSE_TYPE.NO_OF_API_CALLS,
            then: Joi.number().required(),
        }),
        expiresAt: Joi.when('type', {
            is: [LICENSE_TYPE.TIME_BOUND, LICENSE_TYPE.TIME_BOUND_AND_API_CALLS],
            then: Joi.date().required(),
        }),
    }),
};
