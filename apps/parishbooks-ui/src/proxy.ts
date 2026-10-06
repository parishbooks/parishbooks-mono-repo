import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createConfig } from '@/lib/api-client/client';
import { refreshAccessTokenApi } from '@/lib/api-client';
import { isAccessTokenValid, svcBaseUrl } from '@/lib/security/verify-access-token';
import { signInPath } from '@/lib/security/sign-in-path';
import { AUTH_COOKIE_NAMES, hasAuthCookies } from '@/lib/session/auth-cookies';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/lib/session/constants';

/** Dedicated client: no serverFetch/clearSession — proxy handles auth redirects itself. */
const proxyClient = createClient(createConfig({ baseUrl: svcBaseUrl }));

function withPathnameHeader(request: NextRequest): NextResponse {
    const headers = new Headers(request.headers);
    headers.set('x-pathname', request.nextUrl.pathname);
    return NextResponse.next({ request: { headers } });
}

function redirectToSignIn(request: NextRequest, pathname: string): NextResponse {
    const response = NextResponse.redirect(new URL(signInPath(pathname), request.url));
    for (const name of AUTH_COOKIE_NAMES) response.cookies.delete(name);
    return response;
}

function withSetCookies(response: NextResponse, from: Response): NextResponse {
    const setCookies = typeof from.headers.getSetCookie === 'function' ? from.headers.getSetCookie() : [];
    for (const cookie of setCookies) response.headers.append('Set-Cookie', cookie);
    return response;
}

async function refreshAccessToken(request: NextRequest): Promise<Response | null> {
    try {
        const cookie = request.headers.get('cookie');
        if (!cookie) return null;
        const { response } = await refreshAccessTokenApi({ client: proxyClient, headers: { cookie } });
        if (!response?.ok) return null;
        return response;
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const getCookie = (name: string) => request.cookies.get(name)?.value;
    if (!hasAuthCookies(getCookie)) return redirectToSignIn(request, pathname);
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);
    if (accessToken && (await isAccessTokenValid(accessToken))) return withPathnameHeader(request);
    const refreshed = await refreshAccessToken(request);
    if (!refreshed) return redirectToSignIn(request, pathname);
    return withSetCookies(withPathnameHeader(request), refreshed);
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
