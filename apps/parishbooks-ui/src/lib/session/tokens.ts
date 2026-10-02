'use server';

import { deleteCookie, getCookie, setCookie } from '../cookies';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './constants';

export async function getAccessToken(): Promise<string | undefined> {
    return await getCookie(ACCESS_TOKEN_COOKIE_NAME);
}

export async function setAccessToken(token: string): Promise<void> {
    await setCookie(ACCESS_TOKEN_COOKIE_NAME, token);
}

export async function deleteAccessToken(): Promise<void> {
    await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
}

export async function deleteRefreshToken(): Promise<void> {
    await deleteCookie(REFRESH_TOKEN_COOKIE_NAME);
}
