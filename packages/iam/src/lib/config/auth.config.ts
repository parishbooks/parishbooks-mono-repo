import { AuthConfig } from './auth.types';
import { betterAuth } from 'better-auth';
import { OrganizationPlugin } from '../plugins/organization.plugin';
import { createHttpClient } from '../http-client/client';
import { HttpService } from '@nestjs/axios';
import { EmailOtpPlugin } from '../plugins/email-otp.plugin';
import { JwtPlugin } from '../plugins/jwt.plugin';
import { bearer } from 'better-auth/plugins';
import { getDatabaseConfig } from './auth.utils';

export const AUTH_BASE_PATH = '/iam';

export const defineAuth = (config: AuthConfig) => {
    const httpService = new HttpService(createHttpClient({ baseURL: config.baseURL }));
    return betterAuth({
        basePath: AUTH_BASE_PATH,
        baseURL: config.baseURL,
        secret: config.secret,
        appName: 'ParishBooks',
        hooks: {},
        databaseHooks: {},
        database: getDatabaseConfig(config),
        trustedOrigins: config.trustedOrigins,
        advanced: { database: { joins: true, generateId: 'uuid' } },
        emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: 128 },
        emailVerification: { autoSignInAfterVerification: true, sendOnSignUp: true },
        plugins: [OrganizationPlugin.init({ httpService }), EmailOtpPlugin.init(config.emailService), JwtPlugin.init(), bearer()],
    });
};
