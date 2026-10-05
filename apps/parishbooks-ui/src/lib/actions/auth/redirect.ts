import type { RedirectTo } from '@/lib/api-client';
import { safeNextPath } from '@/lib/auth/safe-next-path';

export function pathForRedirect(redirectTo: RedirectTo, email?: string): string {
    if (redirectTo === 'dashboard') return '/dashboard';
    if (redirectTo === 'email-verification') return email ? `/verify-email?email=${encodeURIComponent(email)}` : '/verify-email';
    if (redirectTo === 'password-reset') return email ? `/reset-password?email=${encodeURIComponent(email)}` : '/reset-password';
    if (redirectTo === 'org-setup') return '/onboarding';
    return '/sign-in';
}

export function destinationForRedirect(redirectTo: RedirectTo, options?: { email?: string; next?: string | null }): string {
    if (redirectTo === 'dashboard') return safeNextPath(options?.next);
    return pathForRedirect(redirectTo, options?.email);
}
