import { Version, VersionModel } from '@models';
import mongoose from 'mongoose';

export class VersionRepo {
    /**
     * Find all versions
     */
    public static findAll(): Promise<Version[]> {
        return VersionModel.find()
            .populate({
                path: 'product',
                select: { name: 1 },
            })
            .lean<Version>()
            .exec();
    }

    /**
     * Find version by version id
     * @param id Version id
     */
    public static findById(id: string): Promise<Version | null> {
        return VersionModel.findOne({ _id: mongoose.Types.ObjectId(id) })
            .populate({
                path: 'product',
                select: { name: 1 },
            })
            .lean<Version>()
            .exec();
    }

    /**
     * Create new version
     * @param version Version info
     */
    public static async create(version: Exclude<Version, 'createdAt' | 'updatedAt'>): Promise<Version> {
        const now = new Date();
        const versionConfig = {
            ...version,
            createdAt: now,
            updatedAt: now,
            product: mongoose.Types.ObjectId(version.product._id),
        };
        const newVersion = await (await VersionModel.create(versionConfig)).populate({
            path: 'product',
            select: { name: 1 },
        });
        return newVersion;
    }

    /**
     * Update version
     * @param version Version object
     */
    public static update(version: Partial<Omit<Version, 'createdAt'>>): Promise<Version | null> {
        const update = {
            ...version,
            updatedAt: new Date(),
        };
        return VersionModel.findOneAndUpdate({ _id: version._id }, { $set: { ...update } }, { new: true })
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
    public static async remove(version: Partial<Version>): Promise<Version | null> {
        return VersionModel.findOneAndDelete({ _id: version._id })
            .populate({ path: 'product', select: { name: 1 } })
            .lean<Version>()
            .exec();
    }
}
