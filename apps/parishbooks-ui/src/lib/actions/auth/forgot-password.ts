'use server';

import { forgotPassword as apiForgotPassword } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function forgotPassword(email: string) {
    const { data, error } = await apiForgotPassword({ body: { email } });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to send reset code.') };
    return { success: true as const, data };
}
