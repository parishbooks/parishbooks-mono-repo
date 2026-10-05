import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_MAX_AGE = 1000 * 60 * 15;
export const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30;
export const ACCESS_TOKEN_NAME = 'pb_access_token';
export const REFRESH_TOKEN_NAME = 'pb_refresh_token';
export const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'strict' } as const satisfies CookieOptions;
