import { Product, ProductModel, VersionModel, Version } from '@models';
import mongoose from 'mongoose';

export class ProductRepo {
    /**
     * Find all products
     */
    public static findAll(): Promise<Product[]> {
        return ProductModel.find()
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
    public static findById(id: string): Promise<Product | null> {
        return ProductModel.findOne({ _id: mongoose.Types.ObjectId(id) })
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
        const productConfig = {
            ...product,
            createdAt: now,
            updatedAt: now,
            owner: mongoose.Types.ObjectId(product.owner._id),
        };
        const newProduct = await (await ProductModel.create(productConfig)).populate({
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
        product: Partial<Product> & Exclude<Product, 'versions' | 'createdAt' | 'updatedAt'>,
    ): Promise<Product | null> {
        const updatedProduct = {
            ...product,
            updatedAt: new Date(),
        };

        return ProductModel.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(product._id) },
            { $set: { ...updatedProduct } },
            { new: true },
        )
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
    public static async remove(product: Product): Promise<Product | null> {
        const deletedProduct = await ProductModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(product._id) })
            .populate({
                path: 'version',
                select: { name: 1 },
            })
            .lean<Product>()
            .exec();

        return deletedProduct;
    }
}
