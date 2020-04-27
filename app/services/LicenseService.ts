import { Version, License } from '@models';
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
        const license =
            typeof licenseIdOrLicense === 'string' ? ({ _id: licenseIdOrLicense } as License) : licenseIdOrLicense;
        const fullLicense = await LicenseRepo.findAll(license);
        if (!fullLicense) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return fullLicense;
    }

    /**
     * Find single license
     * @param license License object
     */
    public static async findOne(licenseIdOrLicense: string | License): Promise<License> {
        const license =
            typeof licenseIdOrLicense === 'string' ? ({ _id: licenseIdOrLicense } as License) : licenseIdOrLicense;
        const fullLicense = await LicenseRepo.findOne(license);
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
    public static async remove(licenseIdOrLicense: Partial<License>): Promise<{ deletedCount?: number }> {
        const license = typeof licenseIdOrLicense === 'string' ? { _id: licenseIdOrLicense } : licenseIdOrLicense;
        const res = await LicenseRepo.remove(license);
        if (!res.deletedCount || res.deletedCount < 0) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return res;
    }

    public static async sync(licenseIdOrLicense: string | License): Promise<void> {
        const license = typeof licenseIdOrLicense === 'string' ? { _id: licenseIdOrLicense } : licenseIdOrLicense;
        const fullLicense = await LicenseRepo.findOne(license);
        if (!fullLicense) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        const licenseType = fullLicense.type;

        if (licenseType === LICENSE_TYPE.TIME_BOUND || licenseType === LICENSE_TYPE.TIME_BOUND_AND_API_CALLS) {
            // When license in time bound, check time
            const licenseExpiryDate = fullLicense.expiresAt;
            const currentDate = new Date();
            if (currentDate > licenseExpiryDate) throw new CustomError(ERROR_CODES.LICENSE_EXPIRED);
        }

        if (licenseType === LICENSE_TYPE.NO_OF_API_CALLS || licenseType === LICENSE_TYPE.TIME_BOUND_AND_API_CALLS) {
            // When license has limited number of calls, check and increment
            const totalApiCallsAllowed = fullLicense.allowedApiCalls!;
            const currentApiCallCount = fullLicense.apiCallCounter!;
            if (currentApiCallCount >= totalApiCallsAllowed) throw new CustomError(ERROR_CODES.API_CALLS_EXHAUSTED);
            // Increment current API call counter
            // TODO: Implement locks using versioning
            await LicenseService.update({
                _id: licenseIdOrLicense,
                apiCallCounter: currentApiCallCount + 1,
            });
        }
    }
}
