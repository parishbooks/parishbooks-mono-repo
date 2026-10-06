'use server';

import { signIn as apiSignIn, type SignInDto } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { errorMessage } from '@/lib/utils/error-message';

export async function signIn(body: SignInDto) {
    const { data, error, response } = await apiSignIn({ body });
    if (error) throw new Error(errorMessage(error, 'Sign in failed.'));
    if (response) await applyUpstreamCookies(response);
    return data;
}
