'use server';

import { signOut as apiSignOut } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function signOut() {
    const { error } = await apiSignOut();
    if (error) throw new Error(errorMessage(error, 'Sign out failed.'));
}
