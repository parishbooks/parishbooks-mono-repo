'use server';

import { signUpApi, type SignUpDto } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function signUp(body: SignUpDto) {
    const { data, error } = await signUpApi({ body });
    if (error) throw new Error(errorMessage(error, 'Sign up failed.'));
    return data;
}
