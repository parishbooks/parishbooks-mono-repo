import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(import.meta.dirname, '../../../../.env') });

const appServiceURL = process.env.APP_SVC_URL;
const iamBaseUrl = process.env.IAM_BASE_URL;
const port = process.env.APP_SVC_PORT ?? '8000';
const baseURL = appServiceURL ?? iamBaseUrl ?? `http://localhost:${port}`;

export const authClient = createAuthClient({
    baseURL,
    basePath: '/iam',
    plugins: [organizationClient(), emailOTPClient()],
});
