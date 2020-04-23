import { UserRepo } from '@repositories';
import { User } from '@models';
import { CustomError } from '@core';
import { ERROR_CODES, ERRORS } from '@config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthTokenPayload } from '@types';
import { JsonWebTokenError } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : Math.round(Math.random() * 10).toString();
const JWT_EXPIRY = '1h';

export class AuthService {
    /**
     * Authenticate user and generate token
     * @param credentials Login credentials
     */
    public static async generateAccessToken(credentials: Pick<User, 'email' | 'password'>): Promise<string> {
        const user = await UserRepo.findCompleteByEmail(credentials.email);
        if (!user) throw new CustomError(ERROR_CODES.USER_NOT_REGISTERED);
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (passwordMatch === false) throw new CustomError(ERROR_CODES.INVALID_CREDENTIALS);
        const token = jwt.sign(
            {
                userId: user._id,
                roles: user.roles,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY },
        );
        return token;
    }

    /**
     * Get user info from supplied token
     * @param token String
     */
    public static async getUserFromToken(token: string): Promise<User> {
        let decoded = {} as AuthTokenPayload;

        try {
            decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
        } catch (err) {
            if (err instanceof JsonWebTokenError) throw new CustomError(ERROR_CODES.INVALID_JWT_TOKEN);
        }

        const user = await UserRepo.findOne({ _id: decoded.userId } as User);
        if (!user) throw new CustomError(ERROR_CODES.INVALID_JWT_TOKEN);

        return user;
    }
}
