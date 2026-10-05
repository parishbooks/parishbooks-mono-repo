import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { auth as authInstance, AuthUserSession } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import { RedirectTo, SignInDto, SignInResponseDto } from './dto/signin.dto';
import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_MAX_AGE, REFRESH_TOKEN_NAME } from './constants';
import type { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private readonly auth: BetterAuthService<typeof authInstance>) {}

    private getHeader(token: string): Headers {
        const headers = new Headers();
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
    }

    private async mintAccessToken(session: AuthUserSession): Promise<string> {
        const headers = this.getHeader(session.session.token);
        const result = await this.auth.api.getToken({ headers });
        return result.token;
    }

    private async sendEmailVerificationOtp(email: string, cb: () => Promise<RedirectTo>): Promise<RedirectTo> {
        const result = await this.auth.api.sendVerificationOTP({ body: { email, type: 'email-verification' } });
        if (!result.success) throw new ForbiddenException('Failed to send email verification OTP');
        return await cb();
    }

    private async determineRedirect(session: AuthUserSession): Promise<RedirectTo> {
        if (!session.user.emailVerified) return await this.sendEmailVerificationOtp(session.user.email, () => Promise.resolve(RedirectTo.EMAIL_VERIFICATION));
        if (!session.session.activeOrganizationId) return RedirectTo.ORG_SETUP;
        return RedirectTo.DASHBOARD;
    }

    private setCookies(accessToken: string, refreshToken: string, response: Response): void {
        response.cookie(ACCESS_TOKEN_NAME, accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        response.cookie(REFRESH_TOKEN_NAME, refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE });
    }

    async signIn({ email, password, rememberMe, callbackURL }: SignInDto, response: Response): Promise<SignInResponseDto> {
        const result = await this.auth.api.signInEmail({ body: { email, password, rememberMe, callbackURL } });
        const session = await this.auth.api.getSession({ headers: this.getHeader(result.token) });
        if (!session) throw new UnauthorizedException('Invalid credentials');
        const accessToken = await this.mintAccessToken(session);
        const refreshToken = accessToken; // TODO: Mint refresh token
        const redirect = await this.determineRedirect(session);
        this.setCookies(accessToken, refreshToken, response);
        return new SignInResponseDto({ redirectTo: redirect, accessToken, refreshToken });
    }
}
