import { RoleCode, Role } from '@models';
import { RoleRepo } from '@repositories';

export class RoleService {
    /**
     * Seed default roles
     */
    public static RoleSeeder(): Promise<Role[]> {
        const roles = [RoleCode.ADMIN, RoleCode.CLIENT];
        return Promise.all(roles.map((role) => RoleRepo.create(role)));
    }
}
