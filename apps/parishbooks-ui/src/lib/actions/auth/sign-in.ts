'use server';

import { signIn as apiSignIn, type SignInDto } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function signIn(body: SignInDto) {
    const { data, error } = await apiSignIn({ body });
    if (error) throw new Error(errorMessage(error, 'Sign in failed.'));
    return data;
}
