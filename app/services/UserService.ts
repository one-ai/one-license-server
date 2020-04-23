import { User } from '@models';
import { UserRepo } from '@repositories';
import { RoleCode } from '@models';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import bcrypt from 'bcrypt';

// Define default role assigned to new users
const DEFAULT_ROLE: RoleCode = RoleCode.ADMIN;

export class UserService {
    /**
     * Find all users
     */
    public static async findAll(): Promise<User[]> {
        const users = await UserRepo.findAll({} as User);
        return users;
    }

    /**
     * Find user by user id
     * @param userId User id
     */
    public static async findOne(user: Partial<User>): Promise<User | null> {
        const fullUser = await UserRepo.findOne(user);
        return fullUser;
    }

    /**
     * Create new user
     * @param user User info
     * @param roleCode User role
     */
    public static async create(
        user: Omit<User, 'createdAt' | 'updatedAt' | 'enabled' | 'verified'>,
        roleCode: RoleCode = DEFAULT_ROLE,
    ): Promise<User> {
        const now = new Date();
        const passwordHash = await bcrypt.hash(user.password, 10);
        const newUserConfig: User = {
            ...user,
            createdAt: now,
            updatedAt: now,
            enabled: true,
            verified: false,
            password: passwordHash,
        };
        try {
            const newUser = await UserRepo.create(newUserConfig, roleCode);
            return newUser;
        } catch (err) {
            // When duplicate user
            if (err.message.indexOf('E11000') > -1) throw new CustomError(ERROR_CODES.RESOURCE_EXISTS);
            // Other reasons of error
            else throw err;
        }
    }

    /**
     * Update user
     * @param user User info
     * @param roleCode User role
     */
    public static async update(
        user: Omit<User, 'createdAt' | 'updatedAt'>,
        oldPassword?: string,
    ): Promise<User | User[]> {
        const targetUser = await UserRepo.findOne({ _id: user._id } as User);
        if (!targetUser) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        // When email update, set unverified
        if (user.email && targetUser.email !== user.email) user.verified = false;
        // When password has to be updated, check old password
        if (user.password && !oldPassword) throw new CustomError(ERROR_CODES.INSUFFICIENT_PARAMETERS);
        else if (user.password && oldPassword) {
            const match = await bcrypt.compare(oldPassword, targetUser.password);
            if (match === false) throw new CustomError(ERROR_CODES.INVALID_OLD_PASSWORD);
            user.password = await bcrypt.hash(user.password, 10);
        }
        const updatedUser = await UserRepo.update(user);
        if (!updatedUser) throw new CustomError(ERROR_CODES.RESOURCE_NOT_FOUND);
        return updatedUser;
    }
}
