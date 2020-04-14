import { model, Schema, Document } from 'mongoose';
import { Product } from '@models';

const DOCUMENT_NAME = 'Version';
const COLLECTION_NAME = 'versions';

export interface Version extends Document {
    name: string;
    description?: string;
    product: Product;
    metaData?: Schema.Types.Mixed;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            trim: true,
        },
        description: {
            type: Schema.Types.String,
            trim: true,
            required: false,
        },
        metaData: {
            type: Schema.Types.Mixed,
            required: false,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
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

schema.index({ name: 1, product: 1 }, { unique: true });

export const VersionModel = model<Version>(DOCUMENT_NAME, schema, COLLECTION_NAME);
