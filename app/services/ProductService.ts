import { Product, User, Version } from '@models';
import { ProductRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import { VersionService } from './VersionService';

export class ProductService {
    /**
     * Find all products
     */
    public static async findAll(): Promise<Product[]> {
        const products = await ProductRepo.findAll({} as Product);
        return products;
    }

    /**
     * Find product by id
     * @param productId Product id
     */
    public static async findOne(productIdOrProduct: string | Product): Promise<Product | null> {
        const product =
            typeof productIdOrProduct === 'string' ? ({ _id: productIdOrProduct } as Product) : productIdOrProduct;
        const fullProduct = await ProductRepo.findOne(product);
        return fullProduct;
    }

    /**
     * Create new product
     * @param product Product info
     */
    public static async create(product: Product, userIdOrUser: string | User): Promise<Product> {
        try {
            if (typeof userIdOrUser === 'string') product.owner = { _id: userIdOrUser } as User;
            else product.owner = userIdOrUser;
            const newProduct = await ProductRepo.create(product);
            return newProduct;
        } catch (err) {
            // When duplicate product
            if (err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update product
     * @param Product Product ID or object
     */
    public static async update(productIdOrProduct: string | Product, newProduct: Product): Promise<Product | null> {
        const oldProduct =
            typeof productIdOrProduct === 'string' ? ({ _id: productIdOrProduct } as Product) : productIdOrProduct;
        const updatedProduct = await ProductRepo.update(oldProduct, newProduct);
        return updatedProduct;
    }

    /**
     * Remove product
     * @param productId Product ID or object
     */
    public static async remove(productIdOrProduct: string | Product): Promise<{ deletedCount?: number }> {
        const product: Product =
            typeof productIdOrProduct === 'string' ? ({ _id: productIdOrProduct } as Product) : productIdOrProduct;
        // Delete all versions
        await VersionService.remove({ product: product._id } as Version);
        const result = await ProductRepo.remove(product);
        return result;
    }
}
