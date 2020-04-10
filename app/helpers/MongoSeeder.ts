import { Logger } from '@core';
import { RoleSeeder } from '@services';

/**
 * Seed mongodb
 */
export function MongoSeeder() {
    RoleSeeder()
        .catch((err) => {
            if (err.message.indexOf('E11000') === -1) throw err;
        })
        .then(() => Logger.info('Roles have been seeded'))
        .catch(console.log);
}
