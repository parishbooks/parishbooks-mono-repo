export type TokenKind = 'access' | 'refresh';

export const ACCESS_TOKEN_COOKIE = 'pb_access_token';
export const REFRESH_TOKEN_COOKIE = 'pb_refresh_token';

export const TOKEN_COOKIE_NAMES: Record<TokenKind, string> = {
    access: ACCESS_TOKEN_COOKIE,
    refresh: REFRESH_TOKEN_COOKIE,
};
