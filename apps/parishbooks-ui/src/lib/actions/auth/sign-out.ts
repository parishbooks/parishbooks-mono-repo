'use server';

import { redirect } from 'next/navigation';
import { signOutApi } from '@/lib/api-client';
import { clearAuthCookies } from '@/lib/actions/auth/clear-session';

export async function signOut() {
    try {
        await signOutApi({ signal: AbortSignal.timeout(5_000) });
    } catch {
        /* clear local cookies and redirect anyway */
    }
    await clearAuthCookies();
    redirect('/sign-in');
}
