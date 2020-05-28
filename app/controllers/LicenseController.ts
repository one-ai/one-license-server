import { Request, Response } from 'express';
import { SuccessHandler, CustomError } from '@core';
import { LicenseService } from '@services';
import { License, Version } from '@models';
import { ERROR_CODES } from '@config';

export const LicenseController = {
    create: async function (req: Request, res: Response): Promise<void> {
        const versionId = req.params.versionId;
        const licenseConfig = req.body as License;
        const license = await LicenseService.create(licenseConfig, versionId);
        new SuccessHandler(license, res);
    },
    findOne: async function (req: Request, res: Response): Promise<void> {
        const licenseId = req.params.licenseId;
        const license = await LicenseService.findOne(licenseId);
        if (!license) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(license, res);
    },
    findAll: async function (req: Request, res: Response): Promise<void> {
        const license = { version: { _id: req.params.versionId } as Version } as License;
        const licenses: License[] = await LicenseService.findAll(license);
        new SuccessHandler(licenses, res);
    },
    update: async function (req: Request, res: Response): Promise<void> {
        const licenseId = req.params.licenseId;
        const newLicenseConfig = req.body;
        newLicenseConfig._id = licenseId;
        const license = await LicenseService.update(newLicenseConfig);
        if (!license) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(license, res);
    },
    remove: async function (req: Request, res: Response): Promise<void> {
        const licenseId = req.params.licenseId;
        const license = await LicenseService.remove(licenseId);
        if (!license) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(license, res);
    },
    consume: async function (req: Request, res: Response): Promise<void> {
        const licenseId = req.params.licenseId;
        const licenseRequest = req.body;
        const license = await LicenseService.consume({
            licenseIdOrLicense: licenseId,
            ...licenseRequest,
        });
        new SuccessHandler(license, res);
    },
};
