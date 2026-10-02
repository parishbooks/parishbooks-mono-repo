import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { defineAuth } from './config/auth.config';

loadEnv({ path: path.resolve(process.cwd(), '../../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

/** Better Auth CLI entry (`auth migrate --config ./src/lib/auth.ts`). */
export const auth = defineAuth({
    secret: process.env.IAM_SECRET || '',
    baseURL: process.env.APP_SVC_URL || process.env.IAM_BASE_URL || '',
    databaseUrl: process.env.DATABASE_URL || '',
    trustedOrigins: [process.env.APP_UI_URL || 'http://localhost:3000'],
});
