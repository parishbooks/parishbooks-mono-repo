import {
    forgotPassword as apiForgotPassword,
    resetPassword as apiResetPassword,
    sendEmailOtp as apiSendEmailOtp,
    signIn as apiSignIn,
    signOut as apiSignOut,
    signUp as apiSignUp,
    verifyEmailOtp as apiVerifyEmailOtp,
    type ErrorResponseDto,
    type RedirectTo,
    type SignInDto,
    type SignUpDto,
} from '@/lib/api-client';
import { safeNextPath } from '@/lib/auth/safe-next-path';

function errorMessage(error: ErrorResponseDto | undefined, fallback: string): string {
    if (!error?.message) return fallback;
    return Array.isArray(error.message) ? error.message.join(' ') : error.message;
}

export function pathForRedirect(redirectTo: RedirectTo, email?: string): string {
    if (redirectTo === 'dashboard') return '/dashboard';
    if (redirectTo === 'email-verification') return email ? `/verify-email?email=${encodeURIComponent(email)}` : '/verify-email';
    if (redirectTo === 'password-reset') return email ? `/reset-password?email=${encodeURIComponent(email)}` : '/reset-password';
    if (redirectTo === 'org-setup') return '/onboarding';
    return '/sign-in';
}

export function destinationForRedirect(redirectTo: RedirectTo, options?: { email?: string; next?: string | null }): string {
    if (redirectTo === 'dashboard') return safeNextPath(options?.next);
    return pathForRedirect(redirectTo, options?.email);
}

export async function signUp(body: SignUpDto) {
    const { data, error } = await apiSignUp({ body });
    if (error) throw new Error(errorMessage(error, 'Sign up failed.'));
    return data;
}

export async function signIn(body: SignInDto) {
    const { data, error } = await apiSignIn({ body });
    if (error) throw new Error(errorMessage(error, 'Sign in failed.'));
    return data;
}

export async function signOut() {
    const { error } = await apiSignOut();
    if (error) throw new Error(errorMessage(error, 'Sign out failed.'));
}

export async function sendEmailOtp(email: string) {
    const { data, error } = await apiSendEmailOtp({ body: { email, type: 'email-verification' } });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to send code.') };
    return { success: true as const, data };
}

export async function verifyEmailOtp(email: string, otp: string) {
    const { data, error } = await apiVerifyEmailOtp({ body: { email, otp } });
    if (error) return { success: false as const, error: errorMessage(error, 'Email verification failed.') };
    return { success: true as const, data };
}

export async function forgotPassword(email: string) {
    const { data, error } = await apiForgotPassword({ body: { email } });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to send reset code.') };
    return { success: true as const, data };
}

export async function resetPassword(body: { email: string; otp: string; password: string }) {
    const { data, error } = await apiResetPassword({ body });
    if (error) return { success: false as const, error: errorMessage(error, 'Failed to reset password.') };
    return { success: true as const, data };
}
