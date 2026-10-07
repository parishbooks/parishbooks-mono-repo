import { clearSession } from '@/lib/actions/auth/clear-session';
import { isPublicAuthApiRequest } from '@/lib/security/public-auth-api';
import { refreshAccessTokenOnce } from '@/lib/security/refresh-access-token';
import { client } from '@/lib/api-client/client.gen';

let registered = false;

async function obtainAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return refreshAccessTokenOnce();
    const { refreshSession } = await import('@/lib/actions/auth/refresh-session');
    return refreshSession();
}

/** Register once: on 401, refresh access token and retry once; logout if refresh fails. */
export function registerAuthInterceptors(): void {
    if (registered) return;
    registered = true;

    client.interceptors.response.use(async (response, options) => {
        if (response.status !== 401) return response;
        if (isPublicAuthApiRequest(options.url)) return response;
        // RSC uses the request cookie jar; reminting cookies here triggers Next.js to reload the page.
        // The dashboard proxy refreshes pb_access_token before render when needed.
        if (typeof window === 'undefined') return response;

        const accessToken = await obtainAccessToken();
        if (!accessToken) {
            await clearSession();
            return response;
        }

        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${accessToken}`);
        const retryResponse = await (options.fetch ?? globalThis.fetch)(client.buildUrl(options), {
            method: options.method,
            headers,
            body: options.serializedBody as BodyInit | null | undefined,
            credentials: options.credentials,
        });

        if (retryResponse.status === 401) await clearSession();
        return retryResponse;
    });
}

registerAuthInterceptors();
