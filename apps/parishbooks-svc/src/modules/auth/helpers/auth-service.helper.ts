import { ForbiddenException, Injectable } from '@nestjs/common';
import { auth as authInstance, AuthUserSession } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import { Utils } from '../../../library/utils';
import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME, REFRESH_TOKEN_MAX_AGE, REFRESH_TOKEN_NAME, SESSION_TOKEN_MAX_AGE, SESSION_TOKEN_NAME } from '../constants';
import { RedirectTo, SignInResponseDto } from '../dto/signin.dto';

@Injectable()
export class AuthServiceHelper {
    constructor(private readonly auth: BetterAuthService<typeof authInstance>) {}

    async mintAccessToken(session: AuthUserSession): Promise<string> {
        const headers = Utils.getHeader(session.session.token);
        const result = await this.auth.api.getToken({ headers });
        return result.token;
    }

    async mintRefreshToken(session: AuthUserSession): Promise<string> {
        return session.session.token;
    }

    mintSessionToken(session: AuthUserSession): string {
        return session.session.token;
    }

    async sendEmailVerificationOtp(email: string): Promise<void> {
        const result = await this.auth.api.sendVerificationOTP({ body: { email, type: 'email-verification' } });
        if (!result.success) throw new ForbiddenException('Failed to send email verification OTP');
    }

    async requireEmailVerification(email: string): Promise<SignInResponseDto> {
        await this.sendEmailVerificationOtp(email);
        return new SignInResponseDto({ redirectTo: RedirectTo.EMAIL_VERIFICATION });
    }

    determineRedirect(session: AuthUserSession): RedirectTo {
        if (!session.session.activeOrganizationId) return RedirectTo.ORG_SETUP;
        return RedirectTo.DASHBOARD;
    }

    setCookies(accessToken: string, refreshToken: string, sessionToken: string, response: Response): void {
        const options = Utils.getCookieOptions();
        response.cookie(ACCESS_TOKEN_NAME, accessToken, { ...options, maxAge: ACCESS_TOKEN_MAX_AGE });
        response.cookie(REFRESH_TOKEN_NAME, refreshToken, { ...options, maxAge: REFRESH_TOKEN_MAX_AGE });
        response.cookie(SESSION_TOKEN_NAME, sessionToken, { ...options, maxAge: SESSION_TOKEN_MAX_AGE });
    }

    clearCookies(response: Response): void {
        const options = Utils.getCookieOptions();
        response.clearCookie(ACCESS_TOKEN_NAME, options);
        response.clearCookie(REFRESH_TOKEN_NAME, options);
        response.clearCookie(SESSION_TOKEN_NAME, options);
    }

    async establishSession(session: AuthUserSession, response: Response): Promise<SignInResponseDto> {
        const accessToken = await this.mintAccessToken(session);
        const refreshToken = await this.mintRefreshToken(session);
        const sessionToken = this.mintSessionToken(session);
        this.setCookies(accessToken, refreshToken, sessionToken, response);
        return new SignInResponseDto({ redirectTo: this.determineRedirect(session) });
    }
}
