import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(import.meta.dirname, '../../../../.env') });

export const authClient = createAuthClient({
    baseURL: String(process.env.IAM_BASE_URL),
    plugins: [organizationClient(), emailOTPClient()],
});
