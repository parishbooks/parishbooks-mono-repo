import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, SESSION_TOKEN_NAME } from './constants';

export const AUTH_COOKIE_NAMES = [ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, SESSION_TOKEN_NAME] as const;

export type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[number];

export function hasAuthCookies(getCookie: (name: string) => string | undefined): boolean {
    return Boolean(getCookie(ACCESS_TOKEN_COOKIE_NAME) || getCookie(SESSION_TOKEN_NAME));
}
