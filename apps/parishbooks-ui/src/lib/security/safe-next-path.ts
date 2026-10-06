/** Post-login destinations allowed from `?next=` (must match protected routes). */
const ALLOWED_NEXT_PREFIXES = ['/dashboard', '/onboarding'];

const AUTH_ENTRY_PREFIXES = ['/', '/sign-in', '/sign-up'];

function pathnameOnly(next: string): string {
    return next.split('?')[0]?.split('#')[0] ?? next;
}

/** Reject open redirects; return a same-app path or `fallback`. */
export function safeNextPath(next: string | null | undefined, fallback = '/dashboard'): string {
    if (!next?.trim()) return fallback;
    const raw = next.trim();
    if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
    if (raw.includes('\\')) return fallback;
    const pathname = pathnameOnly(raw);
    if (AUTH_ENTRY_PREFIXES.some((route) => (route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`)))) return fallback;
    if (!ALLOWED_NEXT_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) return fallback;
    return pathname;
}
