import { Application } from '@parishbooks/core';
import { AppModule } from './modules/app.module';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from './modules/auth/constants';

void Application.bootstrap({
    module: AppModule,
    port: Number(process.env.APP_SVC_PORT),
    isProd: process.env.NODE_ENV === 'production',
    corsOrigin: process.env.APP_UI_URL ?? `http://localhost:${process.env.APP_UI_PORT ?? '3000'}`,
    swagger: {
        version: '1',
        title: 'ParishBooks API',
        description: 'ParishBooks service OpenAPI document for generated clients (hey-api).',
        cookieAuth: [
            { name: ACCESS_TOKEN_NAME, cookieName: ACCESS_TOKEN_NAME },
            { name: REFRESH_TOKEN_NAME, cookieName: REFRESH_TOKEN_NAME },
        ],
    },
});
