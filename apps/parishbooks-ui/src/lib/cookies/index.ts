'use server';

import { cookies } from 'next/headers';

export const getCookie = async (name: string): Promise<string | undefined> => {
    const cookie = await cookies();
    const result = cookie.get(name);
    return result ? result.value : undefined;
};

export const setCookie = async (name: string, value: string): Promise<void> => {
    const cookie = await cookies();
    cookie.set(name, value);
};

export const deleteCookie = async (name: string): Promise<void> => {
    const cookie = await cookies();
    cookie.delete(name);
};
