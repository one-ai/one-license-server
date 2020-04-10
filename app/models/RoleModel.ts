import { Schema, model, Document } from 'mongoose';

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'roles';

export const enum RoleCode {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}

export interface Role extends Document {
    code: string;
    status?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema(
    {
        code: {
            type: Schema.Types.String,
            required: true,
            enum: [RoleCode.ADMIN, RoleCode.CLIENT],
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
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

schema.index({ code: 1 }, { unique: true });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
