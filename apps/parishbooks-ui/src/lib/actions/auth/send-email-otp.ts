'use server';

import { sendEmailOtpApi } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function sendEmailOtp(email: string) {
    const { data, error } = await sendEmailOtpApi({ body: { email, type: 'email-verification' } });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to send code.') };
    return { success: true as const, data };
}
