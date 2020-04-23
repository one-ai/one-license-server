import { Router } from 'express';
import { LicenseController, AuthMiddleware } from '@controllers';
import { Validator, ValidationSource } from '@helpers';
import { LicenseValidationSchema } from './LicenseValidationSchema';

const LicenseRouter = Router({ mergeParams: true });

// Find all licenses
LicenseRouter.get(
    '/',
    AuthMiddleware,
    Validator(LicenseValidationSchema.allLicenses, ValidationSource.PARAM),
    LicenseController.findAll,
);

// Create a new license
LicenseRouter.post(
    '/',
    AuthMiddleware,
    Validator(LicenseValidationSchema.allLicenses, ValidationSource.PARAM),
    Validator(LicenseValidationSchema.licenseCreateOrUpdate),
    LicenseController.create,
);

// Find a single license
LicenseRouter.get(
    '/:licenseId',
    AuthMiddleware,
    Validator(LicenseValidationSchema.singleLicense, ValidationSource.PARAM),
    LicenseController.findOne,
);

// Update a license
LicenseRouter.put(
    '/:licenseId',
    AuthMiddleware,
    Validator(LicenseValidationSchema.singleLicense, ValidationSource.PARAM),
    Validator(LicenseValidationSchema.licenseCreateOrUpdate),
    LicenseController.update,
);

// Delete a license
LicenseRouter.delete(
    '/:licenseId',
    AuthMiddleware,
    Validator(LicenseValidationSchema.singleLicense, ValidationSource.PARAM),
    LicenseController.remove,
);

export { LicenseRouter };
