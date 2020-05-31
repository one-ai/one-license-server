import { Version, License, SYNC_TRIGGER } from '@models';
import { LicenseRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import { LICENSE_TYPE } from '@models';
import { VersionService } from './VersionService';

export class LicenseService {
    /**
     * Find all licenses
     */
    public static async findAll(licenseIdOrLicense: string | License): Promise<License[]> {
        const fullLicense = await LicenseRepo.findAll(LicenseService.getIdentifier(licenseIdOrLicense));
        if (!fullLicense) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return fullLicense;
    }

    /**
     * Find single license
     * @param license License object
     */
    public static async findOne(licenseIdOrLicense: string | License): Promise<License> {
        const fullLicense = await LicenseRepo.findOne(LicenseService.getIdentifier(licenseIdOrLicense));
        if (!fullLicense) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return fullLicense;
    }

    /**
     * Create new license
     * @param license License object
     * @param version Version object
     */
    public static async create(license: License, versionIdOrVersion: string | Version): Promise<License> {
        try {
            // Attach version to license config
            const version = await VersionService.findOne(versionIdOrVersion);
            if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
            license.version = version;
            if (license.expiresAt) license.expiresAt = new Date(license.expiresAt);
            // Create license
            const newLicense = await LicenseRepo.create(license);
            if (!newLicense) throw new Error('New license could not be created');
            return newLicense;
        } catch (err) {
            // When duplicate version
            if (err.message && err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update license
     * @param license License object
     */
    public static async update(license: Partial<License>): Promise<License> {
        const updatedLicense = await LicenseRepo.update(license);
        if (!updatedLicense) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return updatedLicense;
    }

    /**
     * Remove licenses
     * @param license License object
     */
    public static async remove(licenseIdOrLicense: string | License): Promise<{ deletedCount?: number }> {
        const res = await LicenseRepo.remove(LicenseService.getIdentifier(licenseIdOrLicense));
        if (!res.deletedCount || res.deletedCount < 0) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return res;
    }

    /**
     * Check license validity and increment api call counter
     * @param consumeInfo License information object
     *
     * Algorithm:
     *
     * 1. Fetch full license record from DB
     * 2. When license.licenseType = TIME_BOUND or license.licenseType = TIME_BOUND_AND_API_CALLS
     *      2.1 When license.expiresAt >= currentDate()
     *          2.1.1 return LICENSE_EXPIRED error
     * 3. When license.activationResetDate = undefined or license.activationResetDate > syncInterval
     *      3.1 license.activationResetDate = currentDate()
     *      3.2 license.activationCounter = 0
     * 4. When request.type = `boot` and license.syncTrigger = SYNC_TRIGGER
     *      4.1 When license.activationCounter < license.activationCounterLimit
     *          4.1.1 When license.activationCounter < license.activationCounterLimit
     *              4.1.1.1 license.activationCounter += 1
     *              4.1.1.2 license.clientConnectionId = clientConnectionId
     *          4.1.2 When license.activationCounter >= license.activationCounterLimit
     *              4.1.2.1 throw ACTIVATION_LIMIT_REACHED error
     * 5. When request.type = `sync`
     *      5.1 When license.licenseType = TIME_BOUND or license.licenseType = TIME_BOUND_AND_API_CALLS
     *          5.1.1 When license.clientConnectionId != clientConnectionId
     *              5.1.1.2 throw INVALID_CONNECTION error
     *      5.2 license.apiCallCounter += increment
     *      5.3 When license.apiCallCounter + increment > license.allowedApiCalls
     *          5.3.1 throw API_CALLS_EXHAUSTED error
     * 6. Return license
     */
    public static async consume(consumeInfo: {
        licenseIdOrLicense: string | License;
        apiCallCounter?: number;
        clientConnectionId?: number;
        type: 'activate' | 'sync';
    }): Promise<License> {
        let license = await LicenseRepo.findOne(LicenseService.getIdentifier(consumeInfo.licenseIdOrLicense));
        if (!license) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        LicenseService.checkValidDuration(license);
        if (consumeInfo.type === 'activate') {
            license = await LicenseService.prepareActivationStats(license);
            license = await LicenseService.activateLicense(license, {
                clientConnectionId: consumeInfo.clientConnectionId!,
            });
        } else
            license = await LicenseService.syncLicense(license, {
                apiCallCounter: consumeInfo.apiCallCounter!,
                clientConnectionId: consumeInfo.clientConnectionId!,
            });
        return license;
    }

    public static getIdentifier = (licenseIdOrLicense: string | License): { _id: string } => {
        if (typeof licenseIdOrLicense === 'string') return { _id: licenseIdOrLicense };
        else return licenseIdOrLicense;
    };

    public static checkValidDuration = (license: License) => {
        const { type, expiresAt } = license;
        if (type === LICENSE_TYPE.TIME_BOUND || type === LICENSE_TYPE.TIME_BOUND_AND_API_CALLS)
            if (new Date(expiresAt!) < new Date()) throw new CustomError(ERROR_CODES.LICENSE_EXPIRED);
    };

    public static prepareActivationStats = async (license: License): Promise<License> => {
        const { activationResetDate, syncTrigger, syncInterval } = license;
        if (syncTrigger === SYNC_TRIGGER.AFTER_INTERVAL) {
            const activationResetDateObj = activationResetDate ? new Date(activationResetDate) : new Date();
            activationResetDateObj.setSeconds(activationResetDateObj.getSeconds() + syncInterval!);
            const currentDate = new Date();
            if (!activationResetDate || activationResetDateObj <= currentDate) {
                const updatedLicense = await LicenseRepo.update({
                    _id: license._id,
                    activationResetDate: currentDate,
                    activationCounter: 0,
                });
                return updatedLicense!;
            }
        }
        return license;
    };

    public static activateLicense = async (
        license: License,
        activationConfig: { clientConnectionId: number },
    ): Promise<License> => {
        const { syncTrigger, activationCounter, activationCounterLimit } = license;
        let updatedLicense: License;
        if (syncTrigger === SYNC_TRIGGER.AFTER_INTERVAL) {
            // For licenses that sync at interval
            if (activationCounter! < activationCounterLimit!) {
                updatedLicense = (await LicenseRepo.update({
                    ...license,
                    activationCounter: activationCounter! + 1,
                    clientConnectionId: activationConfig.clientConnectionId,
                    lastActivation: new Date(),
                })) as License;
            } else throw new CustomError(ERROR_CODES.ACTIVATION_LIMIT_REACHED);
        }
        return updatedLicense!;
    };

    public static syncLicense = async (
        license: License,
        syncConfig: { apiCallCounter: number; clientConnectionId: number },
    ): Promise<License> => {
        const { type, clientConnectionId, apiCallCounter, allowedApiCalls } = license;
        if (type === LICENSE_TYPE.TIME_BOUND || type === LICENSE_TYPE.TIME_BOUND_AND_API_CALLS) {
            // When license is time controlled
            if (clientConnectionId !== syncConfig.clientConnectionId)
                throw new CustomError(ERROR_CODES.INVALID_CONNECTION);
        }
        const updatedLicense = await LicenseRepo.update({
            ...license,
            apiCallCounter:
                apiCallCounter! + syncConfig.apiCallCounter < allowedApiCalls!
                    ? apiCallCounter! + syncConfig.apiCallCounter
                    : allowedApiCalls,
            lastSync: new Date(),
        });
        if (apiCallCounter! + syncConfig.apiCallCounter > allowedApiCalls!)
            throw new CustomError(ERROR_CODES.API_CALLS_EXHAUSTED);
        return updatedLicense!;
    };
}
