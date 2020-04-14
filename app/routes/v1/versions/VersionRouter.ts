import { Router } from 'express';
import { VersionController, AuthMiddleware } from '@controllers';
import { Validator, ValidationSource } from '@helpers';
import { VersionValidationSchema } from './VersionValidationSchema';

const VersionRouter = Router({ mergeParams: true });

// Find all versions
VersionRouter.get(
    '/',
    AuthMiddleware,
    Validator(VersionValidationSchema.productId, ValidationSource.PARAM),
    VersionController.findAll,
);

// Create new product version
VersionRouter.post(
    '/',
    AuthMiddleware,
    Validator(VersionValidationSchema.productId, ValidationSource.PARAM),
    Validator(VersionValidationSchema.versionCreateOrUpdate),
    VersionController.create,
);

// Find single version
VersionRouter.get(
    '/:versionId',
    AuthMiddleware,
    Validator(VersionValidationSchema.singleVersion, ValidationSource.PARAM),
    VersionController.findOne,
);

// Update product
VersionRouter.put(
    '/:versionId',
    AuthMiddleware,
    Validator(VersionValidationSchema.singleVersion, ValidationSource.PARAM),
    Validator(VersionValidationSchema.versionCreateOrUpdate),
    VersionController.update,
);

// Delete single product version
VersionRouter.delete(
    '/:versionId',
    AuthMiddleware,
    Validator(VersionValidationSchema.singleVersion, ValidationSource.PARAM),
    VersionController.remove,
);

export { VersionRouter };
