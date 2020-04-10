import { model, Schema, Document } from 'mongoose';
import { Role } from './RoleModel';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
    enabled: boolean;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema(
    {
        firstName: {
            type: Schema.Types.String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        lastName: {
            type: Schema.Types.String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
            select: false,
        },
        roles: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Role',
                },
            ],
            required: true,
        },
        enabled: {
            type: Schema.Types.Boolean,
            default: true,
        },
        verified: {
            type: Schema.Types.Boolean,
            default: false,
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

schema.index({ email: 1 }, { unique: true });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
