import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';
import { config } from 'dotenv';
import path from 'node:path';

config({ path: path.resolve(process.cwd(), '.env') });

const baseURL = process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;
const uiOrigin = process.env.APP_UI_URL ?? `http://localhost:${process.env.APP_UI_PORT ?? '3000'}`;

export const authClient = createAuthClient({
    baseURL,
    basePath: '/iam',
    fetchOptions: { headers: { origin: uiOrigin } },
    plugins: [organizationClient(), emailOTPClient()],
});
