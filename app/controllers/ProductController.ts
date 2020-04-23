import { Request, Response } from 'express';
import { SuccessHandler, CustomError } from '@core';
import { ProductService } from '@services';
import { Product } from '@models';
import { ERROR_CODES } from '@config';

export const ProductController = {
    create: async function (req: Request, res: Response): Promise<void> {
        const currentUser = req.currentUser;
        const productConfig = {
            name: req.body.name,
            description: req.body.description,
            metaData: req.body.metaData,
        } as Product;
        const product = await ProductService.create(productConfig, currentUser);
        new SuccessHandler(product, res);
    },
    findOne: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const product: Product | null = await ProductService.findOne(productId);
        if (!product) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(product, res);
    },
    findAll: async function (req: Request, res: Response): Promise<void> {
        const products: Product[] = await ProductService.findAll();
        new SuccessHandler(products, res);
    },
    update: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const newProduct = { ...req.body, _id: productId } as Product;
        const product = await ProductService.update(productId, newProduct);
        if (!product) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(product, res);
    },
    remove: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const result = await ProductService.remove(productId);
        if (!result.deletedCount) throw new Error(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(result, res);
    },
};
