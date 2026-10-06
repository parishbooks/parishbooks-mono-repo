import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAMES, hasAuthCookies } from '@/lib/session/auth-cookies';
import { signInPath } from '@/lib/auth/sign-in-path';

function withPathnameHeader(request: NextRequest): NextResponse {
    const headers = new Headers(request.headers);
    headers.set('x-pathname', request.nextUrl.pathname);
    return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authed = hasAuthCookies((name) => request.cookies.get(name)?.value);
    if (authed) return withPathnameHeader(request);

    const response = NextResponse.redirect(new URL(signInPath(pathname), request.url));
    for (const name of AUTH_COOKIE_NAMES) response.cookies.delete(name);
    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
