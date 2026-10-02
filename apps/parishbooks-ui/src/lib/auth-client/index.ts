import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(import.meta.dirname, '../../../../.env') });

const baseURL = process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;

export const authClient = createAuthClient({
    baseURL,
    basePath: '/iam',
    plugins: [organizationClient(), emailOTPClient()],
});
