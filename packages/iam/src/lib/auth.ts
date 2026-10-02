import { defineAuth } from './config/auth.config';
import { authConfigFromEnv } from './config/auth-env';

/** Better Auth CLI entry (`auth migrate --config ./src/lib/auth.ts`). */
export const auth = defineAuth(authConfigFromEnv());
