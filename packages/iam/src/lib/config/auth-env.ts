import type { AuthConfig } from './auth.types';

export const AUTH_BASE_PATH = '/iam';

export function authConfigFromEnv(env: NodeJS.ProcessEnv = process.env): AuthConfig {
    const secret = env.IAM_SECRET ?? env.BETTER_AUTH_SECRET;
    const databaseUrl = env.DATABASE_URL ?? env.IAM_DATABASE_URL;
    const baseURL = env.APP_SVC_URL ?? env.IAM_BASE_URL ?? `http://localhost:${env.APP_SVC_PORT ?? '8000'}`;
    const uiURL = env.APP_UI_URL ?? `http://localhost:${env.APP_UI_PORT ?? '3000'}`;
    if (!secret?.trim() || !databaseUrl?.trim() || !baseURL?.trim() || !uiURL?.trim()) throw new Error('Missing auth environment variables');
    return { secret, databaseUrl, baseURL, trustedOrigins: [uiURL] };
}
