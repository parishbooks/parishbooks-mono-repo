import { refreshAccessTokenApi } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/session/constants';

let refreshPromise: Promise<string | null> | null = null;

function accessTokenFromSetCookie(response: Response): string | null {
    const setCookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
    for (const raw of setCookies) {
        if (!raw.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`)) continue;
        const [pair] = raw.split(';');
        const value = pair.slice(ACCESS_TOKEN_COOKIE_NAME.length + 1);
        if (value) return value;
    }
    return null;
}

async function cookieHeaderFromRequestStore(): Promise<string | undefined> {
    if (typeof window !== 'undefined') return undefined;
    const { cookies } = await import('next/headers');
    const store = await cookies();
    const all = store.getAll();
    if (all.length === 0) return undefined;
    return all.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
}

/** Single-flight remint of pb_access_token. Returns the new token, or null if refresh failed. */
export async function refreshAccessTokenOnce(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const cookie = await cookieHeaderFromRequestStore();
            const { response } = await refreshAccessTokenApi({ ...(cookie ? { headers: { cookie } } : {}) });
            if (!response?.ok) return null;
            if (typeof window === 'undefined') await applyUpstreamCookies(response);
            return accessTokenFromSetCookie(response);
        })().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}
