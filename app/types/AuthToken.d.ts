import { Role } from '@models';

export interface AuthTokenPayload {
    userId: string;
    roles: [Role];
}
