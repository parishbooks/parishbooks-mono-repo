import type { CreateClientConfig } from './api-client/client.gen';

const baseUrl =
    process.env.NEXT_PUBLIC_APP_SVC_URL ?? process.env.APP_SVC_URL ?? process.env.IAM_BASE_URL ?? `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`;

const isServer = typeof window === 'undefined';

const serverFetch: typeof fetch = async (input, init = {}) => {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const headers = new Headers(init.headers);
    const accessToken = cookieStore.get('pb_access_token')?.value;
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return fetch(input, { ...init, headers });
};

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl,
    credentials: 'include',
    ...(isServer ? { fetch: serverFetch } : {}),
});
