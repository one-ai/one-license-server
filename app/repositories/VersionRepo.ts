import { Version, VersionModel } from '@models';

export class VersionRepo {
    /**
     * Find all matching versions
     * @param version Version object
     */
    public static findAll(version: Partial<Version>): Promise<Version[]> {
        return VersionModel.find(version)
            .populate({
                path: 'product',
                select: { name: 1 },
            })
            .lean<Version>()
            .exec();
    }

    /**
     * Find a version
     * @param version Version object
     */
    public static findOne(version: Version): Promise<Version | null> {
        return VersionModel.findOne(version)
            .populate({
                path: 'product',
                select: { name: 1 },
            })
            .lean<Version>()
            .exec();
    }

    /**
     * Create a new version
     * @param version Version object
     */
    public static async create(version: Exclude<Version, 'createdAt' | 'updatedAt'>): Promise<Version> {
        const now = new Date();
        version.createdAt = now;
        version.updatedAt = now;
        const newVersion = await (await VersionModel.create(version)).populate({
            path: 'product',
            select: { name: 1 },
        });
        return newVersion;
    }

    /**
     * Update version
     * @param version Version object
     */
    public static update(
        oldVersion: Partial<Version>,
        newVersion: Partial<Omit<Version, 'createdAt'>>,
    ): Promise<Version | null> {
        newVersion.updatedAt = new Date();
        return VersionModel.findOneAndUpdate(oldVersion, { $set: { ...newVersion } }, { new: true })
            .populate({
                path: 'product',
                select: { name: 1 },
            })
            .lean<Version>()
            .exec();
    }

    /**
     * Delete version
     * @param version Version object
     */
    public static async remove(version: Partial<Version>): Promise<{ deletedCount?: number }> {
        return VersionModel.deleteMany(version).exec();
    }
}
