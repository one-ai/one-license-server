import { Version, Product, License } from '@models';
import { VersionRepo, ProductRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import { LicenseService } from './LicenseService';
import { ProductService } from './ProductService';

export class VersionService {
    /**
     * Find all versions
     */
    public static async findAll(): Promise<Version[]> {
        const versions = await VersionRepo.findAll({} as Version);
        return versions;
    }

    /**
     * Find a version
     */
    public static async findOne(versionIdOrVersion: string | Version): Promise<Version | null> {
        const version =
            typeof versionIdOrVersion === 'string' ? ({ _id: versionIdOrVersion } as Version) : versionIdOrVersion;
        const newVersion = await VersionRepo.findOne(version);
        return newVersion;
    }

    /**
     * Create new version
     * @param version Version object
     * @param product Product object
     */
    public static async create(version: Version, productIdOrProduct: string | Product): Promise<Version> {
        try {
            // Create new version
            const product = await ProductService.findOne(productIdOrProduct);
            if (!product) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
            version.product = product;
            const newVersion = await VersionRepo.create(version);
            if (!newVersion) throw new Error('New version could not be created');
            // Add to product version list
            const storedProduct = await ProductService.findOne(newVersion.product);
            if (!storedProduct) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
            storedProduct.versions.push(newVersion._id);
            await ProductService.update(product, storedProduct);
            return newVersion;
        } catch (err) {
            // When duplicate version
            if (err.message && err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update version
     * @param version Version object
     */
    public static async update(
        versionIdOrVersion: string | Version,
        newVersion: Partial<Version> & Exclude<Version, 'product' | 'createdAt' | 'updatedAt'>,
    ): Promise<Version | null> {
        const version =
            typeof versionIdOrVersion === 'string' ? ({ _id: versionIdOrVersion } as Version) : versionIdOrVersion;
        const updatedVersion = await VersionRepo.update(version, newVersion);
        return updatedVersion;
    }

    /**
     * Remove version
     * @param version Version object
     */
    public static async remove(versionIdOrVersion: string | Version): Promise<{ deletedCount?: number }> {
        const version =
            typeof versionIdOrVersion === 'string' ? ({ _id: versionIdOrVersion } as Version) : versionIdOrVersion;
        // Find version
        const versionRecord = await VersionRepo.findOne(version);
        if (!versionRecord) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        // Remove version
        const removeResult = await VersionRepo.remove(version);
        // Find product
        const product = await ProductService.findOne(versionRecord.product._id);
        if (!product) return removeResult;
        // Pop deleted version from version list
        product.versions = product.versions.filter((version) => version !== versionRecord._id);
        // Update product
        await ProductService.update('' + product._id, product); // FIX: need of converting to string
        // Remove licenses
        await LicenseService.remove({ version: versionRecord._id } as License);
        return removeResult;
    }
}
