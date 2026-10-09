import type { CreateClientConfig } from './lib/client.gen.js';

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: config?.baseUrl ?? 'http://localhost:8000',
    credentials: 'include',
});
