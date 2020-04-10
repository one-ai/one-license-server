import { Role, RoleModel, RoleCode } from '@models';

export class RoleRepo {
    /**
     * Find role by code
     * @param code Role code
     */
    public static findByCode(code: RoleCode): Promise<Role | null> {
        return RoleModel.findOne({
            code: code,
            status: true,
        })
            .lean<Role>()
            .exec();
    }

    /**
     * Create multiple new roles
     * @param codes Role codes
     */
    public static create(code: RoleCode): Promise<Role> {
        return RoleModel.create({
            code: code,
            status: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
