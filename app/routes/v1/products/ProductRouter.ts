import { Router } from 'express';
import { ProductController, AuthMiddleware } from '@controllers';
import { Validator, ValidationSource } from '@helpers';
import { ProductValidationSchema } from './ProductValidationSchema';

const ProductRouter = Router();

// Find all products
ProductRouter.get('/', AuthMiddleware, ProductController.findAll);

// Create product
ProductRouter.post(
    '/',
    AuthMiddleware,
    Validator(ProductValidationSchema.productCreateOrUpdate),
    ProductController.create,
);

// Find single product
ProductRouter.get(
    '/:productId',
    AuthMiddleware,
    Validator(ProductValidationSchema.productId, ValidationSource.PARAM),
    ProductController.findOne,
);

// Update product
ProductRouter.put(
    '/:productId',
    AuthMiddleware,
    Validator(ProductValidationSchema.productId, ValidationSource.PARAM),
    Validator(ProductValidationSchema.productCreateOrUpdate),
    ProductController.update,
);

// Delete single product
ProductRouter.delete(
    '/:productId',
    AuthMiddleware,
    Validator(ProductValidationSchema.productId, ValidationSource.PARAM),
    ProductController.remove,
);

export { ProductRouter };
