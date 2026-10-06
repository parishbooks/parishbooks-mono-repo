'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteCookie } from '@/lib/cookies';
import { signInPath } from '@/lib/auth/sign-in-path';
import { AUTH_COOKIE_NAMES } from '@/lib/session/auth-cookies';

export async function clearAuthCookies(): Promise<void> {
    await Promise.all(AUTH_COOKIE_NAMES.map((name) => deleteCookie(name)));
}

/** Drop local auth cookies and send the user to sign-in. Throws a Next.js redirect. */
export async function clearSession(next?: string | null): Promise<never> {
    await clearAuthCookies();
    if (next !== undefined) redirect(signInPath(next));
    const headerStore = await headers();
    redirect(signInPath(headerStore.get('x-pathname')));
}
