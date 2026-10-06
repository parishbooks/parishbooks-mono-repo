import { safeNextPath } from '@/lib/auth/safe-next-path';

export function signInPath(next?: string | null): string {
    const safeNext = next ? safeNextPath(next, '') : '';
    if (!safeNext || safeNext === '/dashboard') return '/sign-in';
    return `/sign-in?next=${encodeURIComponent(safeNext)}`;
}
