import { Application } from '@parishbooks/core';
import { AppModule } from './modules/app.module';

void Application.bootstrap({
    module: AppModule,
    port: Number(process.env.APP_SVC_PORT),
    isProd: process.env.NODE_ENV === 'production',
    corsOrigin: process.env.APP_UI_URL ?? `http://localhost:${process.env.APP_UI_PORT ?? '3000'}`,
    swagger: {
        version: '1',
        title: 'ParishBooks API',
        description: 'ParishBooks service OpenAPI document for generated clients (hey-api).',
    },
});
