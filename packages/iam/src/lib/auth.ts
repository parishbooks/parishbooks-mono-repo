import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { EmailService } from '@parishbooks/communications';
import { defineAuth } from './config/auth.config';

loadEnv({ path: path.resolve(process.cwd(), '../../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

/** Better Auth CLI entry (`auth migrate --config ./src/lib/auth.ts`). */
export const auth = defineAuth({
    secret: process.env.IAM_SECRET || '',
    baseURL: process.env.APP_SVC_URL || process.env.IAM_BASE_URL || '',
    databaseUrl: process.env.DATABASE_URL || '',
    trustedOrigins: [process.env.APP_UI_URL || 'http://localhost:3000'],
    emailService: new EmailService({
        host: process.env.SMTP_HOST || '',
        port: Number(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE !== 'false',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
    }),
});

export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthUserSession = typeof auth.$Infer.Session;
export type AuthOrganization = typeof auth.$Infer.Organization;
export type AuthActiveOrganization = typeof auth.$Infer.ActiveOrganization;
