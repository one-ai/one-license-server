import { Version, Product } from '@models';
import { VersionRepo, ProductRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';

export class VersionService {
    /**
     * Find all versions
     */
    public static async findAll(): Promise<Version[]> {
        const versions = await VersionRepo.findAll();
        return versions;
    }

    /**
     * Find version
     */
    public static async findOne(versionIdOrVersion: string | Version): Promise<Version | null> {
        const versionConfig = typeof versionIdOrVersion === 'string' ? { _id: versionIdOrVersion } : versionIdOrVersion;
        const version = VersionService.findById(versionConfig._id);
        if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return version;
    }

    /**
     * Find version by id
     * @param versionId Version id
     */
    public static async findById(versionId: string): Promise<Version | null> {
        const version = await VersionRepo.findById(versionId);
        if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return version;
    }

    /**
     * Create new version
     * @param version Version object
     * @param product Product object
     */
    public static async create(version: Version, productIdOrProduct: string | Product): Promise<Version> {
        try {
            if (typeof productIdOrProduct === 'string') version.product = { _id: productIdOrProduct } as Product;
            else version.product = productIdOrProduct;
            const newVersion = await VersionRepo.create(version);
            if (!newVersion) throw new Error('New version could not be created');
            const product = await ProductRepo.findById(newVersion.product._id);
            if (!product) {
                await VersionRepo.remove(newVersion);
                throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
            }
            product.versions.push(newVersion._id);
            await ProductRepo.update(product);
            return newVersion;
        } catch (err) {
            // When duplicate version
            if (err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update version
     * @param version version object
     */
    public static async update(
        version: Partial<Version> & Exclude<Version, 'product' | 'createdAt' | 'updatedAt'>,
    ): Promise<Version | null> {
        const updatedVersion = await VersionRepo.update(version);
        if (!updatedVersion) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return updatedVersion;
    }

    /**
     * Remove version
     * @param version version object
     */
    public static async remove(versionIdOrVersion: Partial<Version>): Promise<Version | null> {
        const versionConfig = typeof versionIdOrVersion === 'string' ? { _id: versionIdOrVersion } : versionIdOrVersion;
        const removedVersion = await VersionRepo.remove(versionConfig);
        if (!removedVersion) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        const product = await ProductRepo.findById(removedVersion.product._id);
        if (!product) return removedVersion;
        product.versions = product.versions.filter((version) => version !== removedVersion._id);
        await ProductRepo.update(product);
        return removedVersion;
    }
}
