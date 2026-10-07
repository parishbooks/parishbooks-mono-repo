import { safeNextPath } from '@/lib/security/safe-next-path';

/** Use a safe `?next=` when sign-in would otherwise open the dashboard. The service path is otherwise final. */
export function destinationForRedirect(redirectTo: string, options?: { next?: string | null }): string {
    const next = options?.next?.trim() ? safeNextPath(options.next, '') : '';
    const opensDashboard = redirectTo === '/dashboard' || redirectTo.startsWith('/dashboard/');
    if (opensDashboard && next && next !== '/dashboard') return next;
    return redirectTo;
}
