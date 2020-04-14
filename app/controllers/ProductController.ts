import { Request, Response } from 'express';
import { SuccessHandler } from '@core';
import { ProductService } from '@services';
import { Product } from '@models';

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
        new SuccessHandler(product, res);
    },
    findAll: async function (req: Request, res: Response): Promise<void> {
        const products: Product[] = await ProductService.findAll();
        new SuccessHandler(products, res);
    },
    update: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const newProductConfig = req.body;
        newProductConfig._id = productId;
        const product: Product = await ProductService.update(newProductConfig);
        new SuccessHandler(product, res);
    },
    remove: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const product: Product = await ProductService.remove(productId);
        new SuccessHandler(product, res);
    },
};
