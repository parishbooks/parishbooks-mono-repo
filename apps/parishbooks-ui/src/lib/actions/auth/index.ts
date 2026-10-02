'use server';
import { headers } from 'next/headers';
import { authClient } from '@/lib/auth-client';
import { setAccessToken } from '@/lib/session';
import { type SignInDto, type SignUpDto } from '@/lib/zod';

async function authRequestHeaders() {
    const headerList = await headers();
    const originHeader = headerList.get('origin');
    if (originHeader) return { origin: originHeader };

    const referer = headerList.get('referer');
    if (referer) {
        try {
            return { origin: new URL(referer).origin };
        } catch {
            // fall through
        }
    }

    return { origin: process.env.APP_UI_URL ?? `http://localhost:${process.env.APP_UI_PORT ?? '3000'}` };
}

export const signUp = async ({ email, password, name }: SignUpDto) => {
    const response = await authClient.signUp.email({ email, password, name }, { headers: await authRequestHeaders() });
    if (response.error) throw new Error(response.error.message);
    return response.data;
};

export const googleSignIn = async () => {
    const response = await authClient.signIn.social(
        { provider: 'google', callbackURL: '/', disableRedirect: true },
        { headers: await authRequestHeaders() },
    );
    if (response.error || !response.data?.url) return { success: false as const, error: response.error?.message ?? 'Google sign-in failed.' };
    return { success: true as const, data: { url: response.data.url } };
};

export const signIn = async ({ email, password }: SignInDto) => {
    const response = await authClient.signIn.email({ email, password }, { headers: await authRequestHeaders() });
    if (response.error) throw new Error(response.error.message);
    const accessToken = response.data.token;
    if (accessToken) await setAccessToken(accessToken);
    return response.data;
};

const notImplemented = { success: false as const, error: 'Not implemented.' };

export const forgotPassword = async (_email: string) => notImplemented;

export const resetPassword = async (_token: string, _password: string) => notImplemented;

export const sendEmailOtp = async (_email: string) => notImplemented;

export const verifyEmailOtp = async (_email: string, _otp: string) => notImplemented;

export const signOut = async () => undefined;
