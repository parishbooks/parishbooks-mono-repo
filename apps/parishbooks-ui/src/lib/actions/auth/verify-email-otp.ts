'use server';

import { verifyEmailOtp as apiVerifyEmailOtp } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { errorMessage } from '@/lib/utils/error-message';

export async function verifyEmailOtp(email: string, otp: string) {
    const { data, error, response } = await apiVerifyEmailOtp({ body: { email, otp } });
    if (error) return { success: false as const, error: errorMessage(error, 'Email verification failed.') };
    if (response) await applyUpstreamCookies(response);
    return { success: true as const, data };
}
