import { model, Schema, Document } from 'mongoose';
import { Version } from '@models';

const DOCUMENT_NAME = 'License';
const COLLECTION_NAME = 'licenses';

export const enum syncStrategy {
    HTTP = 'HTTP',
    SFTP = 'SFTP',
}

export const enum syncTrigger {
    AT_EVERY_CALL = 'AT_EVERY_CALL',
    AFTER_INTERVAL = 'AFTER_INTERVAL',
}

export const enum licenseType {
    TIME_BOUND = 'TIME_BOUND',
    NO_OF_API_CALLS = 'NO_OF_API_CALLS',
}

export interface License extends Document {
    type: licenseType;
    description?: string;
    version: Version;
    metaData?: Schema.Types.Mixed;
    active: boolean;
    expiresAt: Date;
    syncStrategy: syncStrategy;
    syncTrigger: syncTrigger;
    syncInterval?: number;
    allowedApiCalls?: number;
    apiCallCount?: number;
    lastSync?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new Schema(
    {
        type: {
            type: Schema.Types.String,
            required: true,
            enum: [licenseType.TIME_BOUND, licenseType.NO_OF_API_CALLS],
        },
        description: {
            type: Schema.Types.String,
            trim: true,
            required: true,
        },
        metaData: {
            type: Schema.Types.Mixed,
            required: false,
        },
        version: {
            type: Schema.Types.ObjectId,
            ref: 'Version',
            required: true,
        },
        active: {
            type: Schema.Types.Boolean,
            required: false,
            default: true,
        },
        expiresAt: {
            type: Schema.Types.Date,
            required: false,
        },
        syncStrategy: {
            type: Schema.Types.String,
            required: true,
            enum: [syncStrategy.HTTP, syncStrategy.SFTP],
        },
        syncTrigger: {
            type: Schema.Types.String,
            required: true,
            enum: [syncTrigger.AFTER_INTERVAL, syncTrigger.AT_EVERY_CALL],
        },
        syncInterval: {
            type: Schema.Types.Number,
            required: false,
        },
        allowedApiCalls: {
            type: Schema.Types.Number,
            required: false,
            default: 0,
        },
        apiCallCounter: {
            type: Schema.Types.Number,
            required: false,
            default: 0,
        },
        lastSync: {
            type: Schema.Types.Date,
            required: false,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export const LicenseModel = model<License>(DOCUMENT_NAME, schema, COLLECTION_NAME);
