export const PB_ACCESS_TOKEN_COOKIE = 'pb_access_token';
export const PB_REFRESH_TOKEN_COOKIE = 'pb_refresh_token';

/** Matches default JwtModule sign-in access token lifetime (1 day). */
export const ACCESS_TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_REMEMBER_ME_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const AUTH_COOKIE_NAMES = [PB_ACCESS_TOKEN_COOKIE, PB_REFRESH_TOKEN_COOKIE] as const;
