import type { RequestTokens, TokenKind } from '../../guards/auth/auth.types';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_TOKEN_COOKIE } from '../../guards/auth/auth.constants';

export type { TokenKind };
export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_TOKEN_COOKIE };

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
