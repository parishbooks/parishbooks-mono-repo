'use server';
import { headers } from 'next/headers';
import { authClient } from '@/lib/auth-client';
import { resolvePostLoginPath } from '@/lib/auth/post-login-destination';
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

export const sendEmailOtp = async (email: string) => {
    const response = await authClient.emailOtp.sendVerificationOtp(
        { email, type: 'email-verification' },
        { headers: await authRequestHeaders() },
    );
    if (response.error) return { success: false as const, error: response.error.message };
    return { success: true as const };
};

export const verifyEmailOtp = async (email: string, otp: string) => {
    const response = await authClient.emailOtp.verifyEmail({ email, otp }, { headers: await authRequestHeaders() });
    if (response.error) return { success: false as const, error: response.error.message };

    const token = response.data?.token;
    if (token) await setAccessToken(token);

    const user = response.data?.user;
    const destination = resolvePostLoginPath({
        user: {
            email: user?.email ?? email,
            emailVerified: user?.emailVerified ?? true,
        },
        session: { activeOrganizationId: null },
        organizations: [],
    });

    return { success: true as const, data: { destination } };
};

export const signOut = async () => undefined;
