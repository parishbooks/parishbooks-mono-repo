import type { CreateClientConfig } from './lib/client.gen.js';

export const createClientConfig = (config: CreateClientConfig) => ({
    ...config,
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
});
