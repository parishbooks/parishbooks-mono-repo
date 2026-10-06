import type { RequestTokens, TokenKind } from '../../guards/auth/auth.types.js';

export type { TokenKind };

export const ACCESS_TOKEN_COOKIE = 'pb_access_token';
export const REFRESH_TOKEN_COOKIE = 'pb_refresh_token';
export const SESSION_TOKEN_COOKIE = 'pb_session_token';

export const TOKEN_COOKIE_NAMES: Record<TokenKind, string> = {
    access: ACCESS_TOKEN_COOKIE,
    refresh: REFRESH_TOKEN_COOKIE,
    session: SESSION_TOKEN_COOKIE,
};

export const TOKEN_REQUEST_KEYS: Record<TokenKind, keyof RequestTokens> = {
    access: 'accessToken',
    refresh: 'refreshToken',
    session: 'sessionToken',
};
