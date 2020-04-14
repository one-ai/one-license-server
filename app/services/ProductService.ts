import { Product, User } from '@models';
import { ProductRepo } from '@repositories';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';

export class ProductService {
    /**
     * Find all products
     */
    public static async findAll(): Promise<Product[]> {
        const products = await ProductRepo.findAll();
        return products;
    }

    /**
     * Find product by id
     * @param productId Product id
     */
    public static async findOne(productId: string): Promise<Product> {
        const product = await ProductRepo.findById(productId);
        if (!product) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return product;
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
     * @param Product Product info
     */
    public static async update(productIdOrProduct: string | Product, newConfig?: JSON): Promise<Product> {
        const product: Product =
            typeof productIdOrProduct === 'string'
                ? ({ ...newConfig, _id: productIdOrProduct } as Product)
                : productIdOrProduct;
        const updatedProduct = await ProductRepo.update(product);
        if (!updatedProduct) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return updatedProduct;
    }

    /**
     * Remove product
     * @param productId Product ID
     */
    public static async remove(productIdOrProduct: string | Product): Promise<Product> {
        const product: Product =
            typeof productIdOrProduct === 'string' ? ({ _id: productIdOrProduct } as Product) : productIdOrProduct;
        const removedProduct = await ProductRepo.remove(product);
        if (!removedProduct) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return removedProduct;
    }
}
