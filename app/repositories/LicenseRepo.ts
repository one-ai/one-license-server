import { License, LicenseModel } from '@models';
import mongoose, { Schema } from 'mongoose';

export class LicenseRepo {
    /**
     * Find all matching licenses
     * @param license License object
     */
    public static findAll(license: License): Promise<License[]> {
        return LicenseModel.find(license)
            .populate({
                path: 'version',
                select: { name: 1 },
                populate: {
                    path: 'product',
                    select: { name: 1 },
                },
            })
            .lean<License>()
            .exec();
    }

    /**
     * Find one matching license
     * @param license License object
     */
    public static findOne(license: Partial<License>): Promise<License | null> {
        return LicenseModel.findOne(license)
            .populate({
                path: 'version',
                select: { name: 1 },
                populate: {
                    path: 'product',
                    select: { name: 1 },
                },
            })
            .lean<License>()
            .exec();
    }

    /**
     * Create new License
     * @param license License info
     */
    public static async create(license: Exclude<License, 'createdAt' | 'updatedAt'>): Promise<License> {
        const now = new Date();
        const licenseConfig = {
            ...license,
            createdAt: now,
            updatedAt: now,
        };
        const newLicense = await (await LicenseModel.create(licenseConfig)).populate({
            path: 'version',
            select: { name: 1 },
            populate: {
                path: 'product',
                select: { name: 1 },
            },
        });
        return newLicense;
    }

    /**
     * Update license
     * @param license License object
     */
    public static update(license: Partial<Omit<License, 'createdAt'>>): Promise<License | null> {
        license = {
            ...license,
            updatedAt: new Date(),
        };
        return LicenseModel.findOneAndUpdate({ _id: license._id }, { $set: { ...license } }, { new: true })
            .populate({
                path: 'version',
                select: { name: 1 },
                populate: {
                    path: 'product',
                    select: { name: 1 },
                },
            })
            .lean<License>()
            .exec();
    }

    /**
     * Delete license
     * @param license License object
     */
    public static async remove(license: Partial<License>): Promise<{ deletedCount?: number }> {
        return LicenseModel.deleteMany(license).exec();
    }
}
