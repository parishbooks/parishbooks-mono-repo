import type { RedirectTo } from '@/lib/api-client';
import { safeNextPath } from '@/lib/security/safe-next-path';
import { dashboardPath } from '@/lib/utils/paths';

export function pathForRedirect(redirectTo: RedirectTo, email?: string): string {
    if (redirectTo === 'dashboard') return '/dashboard';
    if (redirectTo === 'email-verification') return email ? `/verify-email?email=${encodeURIComponent(email)}` : '/verify-email';
    if (redirectTo === 'password-reset') return email ? `/reset-password?email=${encodeURIComponent(email)}` : '/reset-password';
    if (redirectTo === 'org-setup') return '/onboarding';
    return '/sign-in';
}

export function destinationForRedirect(redirectTo: RedirectTo, options?: { email?: string; next?: string | null; orgSlug?: string | null }): string {
    if (redirectTo !== 'dashboard') return pathForRedirect(redirectTo, options?.email);
    const next = safeNextPath(options?.next);
    if (options?.orgSlug && next === '/dashboard') return dashboardPath(options.orgSlug);
    return next;
}
