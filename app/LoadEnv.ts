import dotenv from 'dotenv';
import { REQUIRED_ENV } from './config/env';

if (process.env.NODE_ENV !== 'production') {
    // When not production environment
    const loadResult = dotenv.config({
        path: `./env/development.env`,
    });

    if (loadResult.error) {
        throw loadResult.error;
    }
}

const missingVars: string[] = REQUIRED_ENV.filter((name: string) => process.env[name] === undefined);
if (missingVars.length)
    throw new Error('Missing environment variables, ' + missingVars.join());