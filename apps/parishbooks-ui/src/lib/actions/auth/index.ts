'use server';

import { redirect } from 'next/navigation';
import { deleteAccessToken, deleteRefreshToken } from '@/lib/session';

export type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string };

const notConfigured = 'Authentication API is not connected yet. Wire server actions to IAM when ready.';

export async function signIn(_email: string, _password: string, _rememberMe?: boolean, next?: string | null): Promise<ActionResult> {
    return { success: false, error: notConfigured };
}

export async function signUp(_name: string, _email: string, _password: string): Promise<ActionResult> {
    return { success: false, error: notConfigured };
}

export async function googleSignIn(_callbackURL?: string): Promise<ActionResult<{ url: string }>> {
    return { success: false, error: notConfigured };
}

export async function signOut(): Promise<ActionResult> {
    await deleteAccessToken();
    await deleteRefreshToken();
    redirect('/sign-in');
}

export async function getSession(): Promise<ActionResult<never>> {
    return { success: false, error: notConfigured };
}

export async function refreshAccessToken(): Promise<ActionResult<{ token: string }>> {
    return { success: false, error: notConfigured };
}

export async function sendEmailOtp(_email: string): Promise<ActionResult<{ status: boolean }>> {
    return { success: false, error: notConfigured };
}

export async function verifyEmailOtp(_email: string, _otp: string): Promise<ActionResult> {
    return { success: false, error: notConfigured };
}

export async function forgotPassword(_email: string): Promise<ActionResult<{ message: string }>> {
    return { success: false, error: notConfigured };
}

export async function resetPassword(_token: string, _newPassword: string): Promise<ActionResult> {
    return { success: false, error: notConfigured };
}

export async function changePassword(_currentPassword: string, _newPassword: string, _revokeOtherSessions?: boolean): Promise<ActionResult> {
    return { success: false, error: notConfigured };
}

export async function updateProfile(_input: { name?: string; image?: string }): Promise<ActionResult<{ status: boolean }>> {
    return { success: false, error: notConfigured };
}
