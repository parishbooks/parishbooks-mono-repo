'use server';
import { ApiSdk, SignInDto } from '@parishbooks/api-sdk';

export async function signIn({ email, password }: SignInDto) {
    const api = new ApiSdk();
    const { data, error, response } = await api.signIn({ body: { email, password } });
    if (error) throw new Error(error.message);
    console.log(`Cookies: ${response?.headers.get('set-cookie')}`);
    return data;
}
