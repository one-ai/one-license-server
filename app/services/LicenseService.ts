import { Version, License } from '@models';
import { LicenseRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';

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
        console.log('herexxxxxx');
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
            license.version =
                typeof versionIdOrVersion === 'string' ? ({ _id: versionIdOrVersion } as Version) : versionIdOrVersion;
            // Create license
            const newLicense = await LicenseRepo.create(license);
            if (!newLicense) throw new Error('New license could not be created');
            return newLicense;
        } catch (err) {
            // When duplicate version
            if (err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update license
     * @param license License object
     */
    public static async update(
        license: Partial<License> & Exclude<Version, 'version' | 'createdAt' | 'updatedAt'>,
    ): Promise<License> {
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
}
