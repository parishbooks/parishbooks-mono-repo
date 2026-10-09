import { ConfigType, registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    port: Number(process.env.APP_SVC_PORT),
    uiPort: Number(process.env.APP_UI_PORT ?? '3000'),
    uiUrl: process.env.APP_UI_URL,
    svcUrl: process.env.APP_SVC_URL,
    env: process.env.NODE_ENV ?? 'development',
}));

export type AppConfig = ConfigType<typeof appConfig>;
