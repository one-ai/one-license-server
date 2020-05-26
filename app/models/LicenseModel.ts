import { model, Schema, Document } from 'mongoose';
import { Version } from '@models';

const DOCUMENT_NAME = 'License';
const COLLECTION_NAME = 'licenses';

export const enum SYNC_STRATEGY {
    HTTP = 'HTTP',
    SFTP = 'SFTP',
}

export const enum SYNC_TRIGGER {
    AT_EVERY_CALL = 'AT_EVERY_CALL',
    AFTER_INTERVAL = 'AFTER_INTERVAL',
}

export const enum LICENSE_TYPE {
    TIME_BOUND = 'TIME_BOUND',
    NO_OF_API_CALLS = 'NO_OF_API_CALLS',
    TIME_BOUND_AND_API_CALLS = 'TIME_BOUND_AND_API_CALLS',
}

export const enum CLIENT_TYPE {
    INDEPENDENT_CLIENT = 'INDEPENDENT_CLIENT',
    THIN_CLIENT = 'THIN_CLIENT',
}

export interface License extends Document {
    name: string;
    type: LICENSE_TYPE;
    clientType?: CLIENT_TYPE;
    activationDelay: number;
    description?: string;
    clientConnectionId?: number;
    clientIdentifier?: string;
    version: Version;
    metaData?: Schema.Types.Mixed;
    active: boolean;
    expiresAt: Date;
    syncStrategy: SYNC_STRATEGY;
    syncTrigger: SYNC_TRIGGER;
    syncInterval?: number;
    allowedApiCalls?: number;
    apiCallCounter?: number;
    lastSync?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            trim: true,
            required: true,
        },
        type: {
            type: Schema.Types.String,
            required: true,
            enum: [LICENSE_TYPE.TIME_BOUND, LICENSE_TYPE.NO_OF_API_CALLS, LICENSE_TYPE.TIME_BOUND_AND_API_CALLS],
        },
        clientType: {
            type: Schema.Types.String,
            required: true,
            default: CLIENT_TYPE.INDEPENDENT_CLIENT,
            enum: [CLIENT_TYPE.INDEPENDENT_CLIENT, CLIENT_TYPE.THIN_CLIENT],
        },
        clientConnectionId: {
            type: Schema.Types.Number,
            required: false,
        },
        clientIdentifier: {
            type: Schema.Types.String,
            required: false,
        },
        activationDelay: {
            type: Schema.Types.Number,
            default: 0,
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
            enum: [SYNC_STRATEGY.HTTP, SYNC_STRATEGY.SFTP],
        },
        syncTrigger: {
            type: Schema.Types.String,
            required: true,
            enum: [SYNC_TRIGGER.AFTER_INTERVAL, SYNC_TRIGGER.AT_EVERY_CALL],
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
