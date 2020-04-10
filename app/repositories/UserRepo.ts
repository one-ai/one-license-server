import { User, UserModel, Role, RoleModel, RoleCode } from '@models';
import mongoose from 'mongoose';

export class UserRepo {
    /**
     * Find all users
     */
    public static findAll(): Promise<User[]> {
        return UserModel.find()
            .populate({
                path: 'roles',
                select: { code: 1 },
            })
            .lean<User>()
            .exec();
    }

    /**
     * Find user by user id
     * @param id User id
     */
    public static findById(id: string): Promise<User | null> {
        return UserModel.findOne({ _id: mongoose.Types.ObjectId(id) })
            .populate({
                path: 'roles',
                select: { code: 1 },
            })
            .lean<User>()
            .exec();
    }

    /**
     * Find full user info
     * @param id User id
     */
    public static findCompleteById(id: string): Promise<User | null> {
        return UserModel.findOne({ _id: mongoose.Types.ObjectId(id) })
            .select('+password')
            .populate({
                path: 'roles',
                select: { code: 1 },
            })
            .lean<User>()
            .exec();
    }

    /**
     * Find user by user email
     * @param email User email
     */
    public static findByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({ email: email })
            .populate({
                path: 'roles',
                select: { code: 1 },
            })
            .lean<User>()
            .exec();
    }

    /**
     * Create new user
     * @param user User object
     * @param roleCode Role code
     */
    public static async create(user: User, roleCode: RoleCode): Promise<User> {
        const now = new Date();

        const role = await RoleModel.findOne({ code: roleCode }).lean<Role>().exec();
        if (!role) throw new Error('Role not found');

        user.roles = [role._id];
        user.createdAt = user.updatedAt = now;
        const createdUser = await (await UserModel.create(user)).populate({
            path: 'roles',
            select: { code: 1 },
        });
        return createdUser;
    }

    /**
     * Update user
     * @param user User object with updated info
     */
    public static update(user: Omit<User, 'updatedAt' | 'createdAt'>): Promise<User | User[] | null> {
        const updatedUser = {
            ...user,
            updatedAt: new Date(),
        };
        return UserModel.findOneAndUpdate({ _id: user._id }, { $set: { ...updatedUser } }, { new: true })
            .populate({
                path: 'roles',
                select: { code: 1 },
            })
            .lean<User>()
            .exec();
    }
}
