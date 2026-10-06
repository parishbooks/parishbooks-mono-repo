/** Auth endpoints that may legitimately return 401 without forcing a local logout. */
const PUBLIC_AUTH_API_PATHS = [
    '/api/v1/auth/sign-in',
    '/api/v1/auth/sign-up',
    '/api/v1/auth/sign-out',
    '/api/v1/auth/email-otp/send',
    '/api/v1/auth/email-otp/verify',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/reset-password',
] as const;

function pathnameFromInput(input: RequestInfo | URL): string {
    if (typeof input === 'string') return new URL(input, 'http://local').pathname;
    if (input instanceof URL) return input.pathname;
    return new URL(input.url, 'http://local').pathname;
}

export function isPublicAuthApiRequest(input: RequestInfo | URL | string): boolean {
    const pathname = typeof input === 'string' && input.startsWith('/') ? input.split('?')[0] ?? input : pathnameFromInput(input);
    return PUBLIC_AUTH_API_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
