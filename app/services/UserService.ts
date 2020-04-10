import { User } from '@models';
import { UserRepo } from '@repositories';
import { RoleCode } from '@models';
import { ERROR_CODES } from '@config';
import { CustomError } from '@core';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Define default role assigned to new users
const DEFAULT_ROLE: RoleCode = RoleCode.ADMIN;
const JWT_SECRET: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : Math.round(Math.random() * 10).toString();
const JWT_EXPIRY = '1h';

export class UserService {
    /**
     * Find all users
     */
    public static async findAll(): Promise<User[]> {
        const users = await UserRepo.findAll();
        return users;
    }

    /**
     * Find user by user id
     * @param userId User id
     */
    public static async findOne(userId: string): Promise<User | null> {
        const user = await UserRepo.findById(userId);
        return user;
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
        const targetUser = await UserRepo.findCompleteById(user._id);
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

    /**
     * Authenticate user and generate token
     * @param credentials Login credentials
     */
    public static async authenticate(credentials: Pick<User, 'email' | 'password'>): Promise<string> {
        const user = await UserRepo.findCompleteByEmail(credentials.email);
        if (!user) throw new CustomError(ERROR_CODES.USER_NOT_REGISTERED);
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (passwordMatch === false) throw new CustomError(ERROR_CODES.INVALID_CREDENTIALS);
        const token: string = jwt.sign(
            {
                id: user._id,
                roles: user.roles,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY },
        );
        return token;
    }
}
