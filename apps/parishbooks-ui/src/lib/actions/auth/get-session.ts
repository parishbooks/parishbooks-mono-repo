'use server';

import { getCurrentSessionApi } from '@/lib/api-client';
import { clearSession } from './clear-session';
import type { AuthUserSession } from '@parishbooks/iam';

export async function getSession() {
    const { data, error } = await getCurrentSessionApi();
    if (error || !data) clearSession();
    return data as AuthUserSession;
}
