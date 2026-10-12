import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import {
    ACCESS_TOKEN_MAX_AGE_MS,
    AUTH_COOKIE_NAMES,
    PB_ACCESS_TOKEN_COOKIE,
    PB_REFRESH_TOKEN_COOKIE,
    REFRESH_TOKEN_MAX_AGE_MS,
    REFRESH_TOKEN_REMEMBER_ME_MAX_AGE_MS,
} from '../constants/cookie.constant';

export type AuthCookieTokens = {
    accessToken: string;
    refreshToken: string;
};

export type SetAuthCookiesOptions = {
    rememberMe?: boolean;
};

@Injectable()
export class CookieService {
    constructor(private readonly configService: ConfigService) {}

    setAuthCookies(response: Response, tokens: AuthCookieTokens, options?: SetAuthCookiesOptions): void {
        const refreshMaxAgeMs = options?.rememberMe ? REFRESH_TOKEN_REMEMBER_ME_MAX_AGE_MS : REFRESH_TOKEN_MAX_AGE_MS;
        response.cookie(PB_ACCESS_TOKEN_COOKIE, tokens.accessToken, this.authCookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
        response.cookie(PB_REFRESH_TOKEN_COOKIE, tokens.refreshToken, this.authCookieOptions(refreshMaxAgeMs));
    }

    setAccessTokenCookie(response: Response, accessToken: string): void {
        response.cookie(PB_ACCESS_TOKEN_COOKIE, accessToken, this.authCookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
    }

    clearAuthCookies(response: Response): void {
        for (const name of AUTH_COOKIE_NAMES) response.clearCookie(name, this.baseCookieOptions());
    }

    private authCookieOptions(maxAgeMs: number): CookieOptions {
        return { ...this.baseCookieOptions(), maxAge: maxAgeMs };
    }

    private baseCookieOptions(): CookieOptions {
        const isProd = this.configService.get<string>('app.env') === 'production';
        return { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };
    }
}
