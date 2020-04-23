import { Product, ProductModel, VersionModel, Version } from '@models';
import mongoose from 'mongoose';

export class ProductRepo {
    /**
     * Find all matching products
     * @param product Product object
     */
    public static findAll(product: Partial<Product>): Promise<Product[]> {
        return ProductModel.find(product)
            .populate({
                path: 'versions',
                select: { name: 1 },
            })
            .lean<Product>()
            .exec();
    }

    /**
     * Find product by id
     * @param id Product id
     */
    public static findOne(product: Partial<Product>): Promise<Product | null> {
        return ProductModel.findOne(product)
            .populate({
                path: 'versions',
                select: { name: 1 },
            })
            .lean<Product>()
            .exec();
    }

    /**
     * Create new product
     * @param product Product object
     */
    public static async create(product: Exclude<Product, 'createdAt' | 'updatedAt' | 'versions'>): Promise<Product> {
        const now = new Date();
        product.createdAt = now;
        product.updatedAt = now;
        const newProduct = await (await ProductModel.create(product)).populate({
            path: 'versions',
            select: { name: 1 },
        });

        return newProduct;
    }

    /**
     * Update product
     * @param product Product object
     */
    public static update(
        oldProduct: Partial<Product>,
        newProduct: Partial<Product> & Exclude<Product, 'versions' | 'createdAt' | 'updatedAt'>,
    ): Promise<Product | null> {
        newProduct.updatedAt = new Date();
        return ProductModel.findOneAndUpdate(oldProduct, { $set: { ...newProduct } }, { new: true })
            .populate({
                path: 'versions',
                select: { name: 1 },
            })
            .lean<Product>()
            .exec();
    }

    /**
     * Delete product
     * @param product product object
     */
    public static async remove(product: Partial<Product>): Promise<{ deletedCount?: number }> {
        const deletedProduct = ProductModel.deleteMany(product).exec();
        return deletedProduct;
    }
}
