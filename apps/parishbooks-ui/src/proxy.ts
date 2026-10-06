import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createConfig } from '@/lib/api-client/client';
import { getCurrentSessionApi } from '@/lib/api-client';
import { AUTH_COOKIE_NAMES, hasAuthCookies } from '@/lib/session/auth-cookies';
import { signInPath } from '@/lib/auth/sign-in-path';

const svcBaseUrl = (
    process.env.NEXT_PUBLIC_APP_SVC_URL ??
    process.env.APP_SVC_URL ??
    process.env.IAM_BASE_URL ??
    `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`
).replace(/\/$/, '');

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

async function isSessionValid(request: NextRequest): Promise<boolean> {
    try {
        const cookie = request.headers.get('cookie');
        if (!cookie) return false;
        const proxyClient = createClient(createConfig({ baseUrl: svcBaseUrl }));
        const { response } = await getCurrentSessionApi({ client: proxyClient, headers: { cookie } });
        if (response?.status === 401 || response?.status === 403) return false;
        return true;
    } catch {
        return true;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const getCookie = (name: string) => request.cookies.get(name)?.value;
    if (!hasAuthCookies(getCookie)) return redirectToSignIn(request, pathname);
    const valid = await isSessionValid(request);
    if (!valid) return redirectToSignIn(request, pathname);
    return withPathnameHeader(request);
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
