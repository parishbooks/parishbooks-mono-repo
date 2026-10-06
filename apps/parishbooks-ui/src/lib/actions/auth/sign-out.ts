'use server';

import { redirect } from 'next/navigation';
import { signOutApi } from '@/lib/api-client';
import { deleteCookie } from '@/lib/cookies';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, SESSION_TOKEN_NAME } from '@/lib/session/constants';

async function clearAuthCookies(): Promise<void> {
    await Promise.all([deleteCookie(ACCESS_TOKEN_COOKIE_NAME), deleteCookie(REFRESH_TOKEN_COOKIE_NAME), deleteCookie(SESSION_TOKEN_NAME)]);
}

export async function signOut() {
    try {
        await signOutApi({ signal: AbortSignal.timeout(5_000) });
    } catch {
        /* clear local cookies and redirect anyway */
    }
    await clearAuthCookies();
    redirect('/sign-in');
}
