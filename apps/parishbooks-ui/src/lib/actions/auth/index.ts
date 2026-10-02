'use server';
import { type SignUpValues } from '@/components/auth/types';
import { authClient } from '@/lib/auth-client';

export const signUp = async ({ email, password, name }: SignUpValues) => {
    const response = await authClient.signUp.email({ email, password, name });
    if (response.error) throw new Error(response.error.message);
    return response.data;
};

export const googleSignIn = async () => {
    const response = await authClient.signIn.social({ provider: 'google', callbackURL: '/', disableRedirect: true });
    if (response.error || !response.data?.url) return { success: false as const, error: response.error?.message ?? 'Google sign-in failed.' };
    return { success: true as const, data: { url: response.data.url } };
};

const notImplemented = { success: false as const, error: 'Not implemented.' };

export const signIn = async (_email: string, _password: string, _callbackURL?: string, _next?: string | null) => notImplemented;

export const forgotPassword = async (_email: string) => notImplemented;

export const resetPassword = async (_token: string, _password: string) => notImplemented;

export const sendEmailOtp = async (_email: string) => notImplemented;

export const verifyEmailOtp = async (_email: string, _otp: string) => notImplemented;

export const signOut = async () => undefined;
