import { AuthConfig } from './auth.types';
import { betterAuth } from 'better-auth';
import { OrganizationPlugin } from '../plugins/organization.plugin';
import { createHttpClient } from '../http-client/client';
import { HttpService } from '@nestjs/axios';
import { PostgresDialect } from 'kysely';
import { EmailOtpPlugin } from '../plugins/email-otp.plugin';
import { JwtPlugin } from '../plugins/jwt.plugin';
import { bearer } from 'better-auth/plugins';
import { Pool } from 'pg';

const getDatabaseConfig = (config: AuthConfig) => {
    return {
        type: 'postgres',
        schemaName: 'authentication',
        dialect: new PostgresDialect({ pool: new Pool({ connectionString: config.databaseUrl }) }),
    };
};

export const defineAuth = (config: AuthConfig) => {
    const httpService = new HttpService(createHttpClient({ baseURL: config.baseURL }));

    return betterAuth({
        basePath: '/iam',
        baseURL: config.baseURL,
        secret: config.secret,
        appName: 'ParishBooks',
        database: getDatabaseConfig(config),
        advanced: { database: { joins: true, generateId: 'uuid' } },
        emailAndPassword: { enabled: true, requireEmailVerification: true, minPasswordLength: 6 },
        plugins: [OrganizationPlugin.init({ httpService }), EmailOtpPlugin.init(), JwtPlugin.init(), bearer()],
    });
};
