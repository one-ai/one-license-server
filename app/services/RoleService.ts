import { RoleCode, Role } from '@models';
import { RoleRepo } from '@repositories';

/**
 * Seed default roles
 */
export async function RoleSeeder(): Promise<Role[]> {
    const roles = [RoleCode.ADMIN, RoleCode.CLIENT];
    return Promise.all(roles.map((role) => RoleRepo.create(role)));
}
