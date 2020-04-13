import { Logger } from '@core';
import { RoleService } from '@services';

/**
 * Seed mongodb
 */
export function MongoSeeder(): void {
    RoleService.RoleSeeder()
        .catch((err) => {
            if (err.message.indexOf('E11000') === -1) throw err;
        })
        .then(() => Logger.info('Roles have been seeded'))
        .catch(console.log);
}
