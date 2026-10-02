import { AuthConfig } from './auth.types';
import { betterAuth } from 'better-auth';
import { OrganizationPlugin } from '../plugins/organization.plugin';
import { createHttpClient } from '../http-client/client';
import { HttpService } from '@nestjs/axios';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const defineAuth = (config: AuthConfig) => {
    const httpService = new HttpService(createHttpClient({ baseURL: config.baseURL }));

    return betterAuth({
        basePath: '/iam',
        baseURL: config.baseURL,
        secret: config.secret,
        appName: 'ParishBooks',
        database: {
            type: 'postgres',
            schemaName: 'authentication',
            dialect: new PostgresDialect({ pool: new Pool({ connectionString: config.databaseUrl }) }),
        },
        emailAndPassword: { enabled: true, requireEmailVerification: true },
        plugins: [OrganizationPlugin.init({ httpService })],
    });
};
