'use server';

import { resetPassword as apiResetPassword } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function resetPassword(body: { email: string; otp: string; password: string }) {
    const { data, error } = await apiResetPassword({ body });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to reset password.') };
    return { success: true as const, data };
}
