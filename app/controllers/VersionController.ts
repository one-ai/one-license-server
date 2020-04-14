import { Request, Response } from 'express';
import { SuccessHandler, CustomError } from '@core';
import { VersionService } from '@services';
import { Version } from '@models';
import { ERROR_CODES } from '@config';

export const VersionController = {
    create: async function (req: Request, res: Response): Promise<void> {
        const productId = req.params.productId;
        const versionConfig = {
            name: req.body.name,
            description: req.body.description,
            metaData: req.body.metaData,
        } as Version;
        const version = await VersionService.create(versionConfig, productId);
        new SuccessHandler(version, res);
    },
    findOne: async function (req: Request, res: Response): Promise<void> {
        const versionId = req.params.versionId;
        const version: Version | null = await VersionService.findOne(versionId);
        if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(version, res);
    },
    findAll: async function (req: Request, res: Response): Promise<void> {
        const versions: Version[] = await VersionService.findAll();
        new SuccessHandler(versions, res);
    },
    update: async function (req: Request, res: Response): Promise<void> {
        const versionId = req.params.versionId;
        const newProductConfig = req.body;
        newProductConfig._id = versionId;
        const version: Version | null = await VersionService.update(newProductConfig);
        if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(version, res);
    },
    remove: async function (req: Request, res: Response): Promise<void> {
        const versionId = req.params.versionId;
        const version: Version | null = await VersionService.remove(versionId);
        if (!version) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        new SuccessHandler(version, res);
    },
};
