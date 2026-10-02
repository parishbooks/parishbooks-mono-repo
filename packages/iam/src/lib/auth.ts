import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { defineAuth } from './config/auth.config';
import { authConfigFromEnv } from './config/auth-env';

loadEnv({ path: path.resolve(process.cwd(), '../../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

/** Better Auth CLI entry (`auth migrate --config ./src/lib/auth.ts`). */
export const auth = defineAuth(authConfigFromEnv());
