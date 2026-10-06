'use server';

import { refreshAccessTokenOnce } from '@/lib/auth/refresh-access-token';

/** Client-callable refresh; updates httpOnly cookies and returns the new access token. */
export async function refreshSession(): Promise<string | null> {
    return refreshAccessTokenOnce();
}
