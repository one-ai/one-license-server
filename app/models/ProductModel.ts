import { model, Schema, Document } from 'mongoose';
import { User, Version } from '@models';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

export interface Product extends Document {
    name: string;
    description: string;
    versions: Version[];
    owner: User;
    metaData: Schema.Types.Mixed;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: Schema.Types.String,
            required: false,
            trim: true,
        },
        versions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Version',
            },
        ],
        metaData: {
            type: Schema.Types.Mixed,
            required: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

schema.index({ name: 1 }, { unique: true });

export const ProductModel = model<Product>(DOCUMENT_NAME, schema, COLLECTION_NAME);
