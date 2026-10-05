import type { CreateClientConfig } from './api-client/client.gen';

const baseUrl =
    process.env.NEXT_PUBLIC_APP_SVC_URL ?? process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl,
    credentials: 'include',
});
