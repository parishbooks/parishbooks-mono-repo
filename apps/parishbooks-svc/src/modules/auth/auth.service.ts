import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { isAPIError } from 'better-auth/api';
import { auth as authInstance, AuthUserSession } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import { ACCESS_TOKEN_MAX_AGE, ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME, SESSION_TOKEN_NAME } from './constants';
import { AuthRedirectHelper } from './helpers/auth-redirect.helper';
import {
    ForgotPasswordDto,
    ResetPasswordDto,
    SendEmailOtpDto,
    SignInDto,
    SignInResponseDto,
    SignUpDto,
    SuccessResponseDto,
    VerifyEmailOtpDto,
} from './dto/signin.dto';
import { AuthServiceHelper } from './helpers/auth-service.helper';
import { Utils } from '../../library/utils';

@Injectable()
export class AuthService {
    constructor(
        private readonly auth: BetterAuthService<typeof authInstance>,
        private readonly helper: AuthServiceHelper,
    ) {}

    async signIn({ email, password, rememberMe }: SignInDto, response: Response): Promise<SignInResponseDto> {
        try {
            const result = await this.auth.api.signInEmail({ body: { email, password, rememberMe } });
            const session = await this.auth.api.getSession({ headers: Utils.getHeader(result.token) });
            if (!session) throw new UnauthorizedException('Invalid credentials');
            if (!session.user.emailVerified) return await this.helper.requireEmailVerification(email);
            return await this.helper.establishSession(session, response);
        } catch (error) {
            if (isAPIError(error)) throw new UnauthorizedException(error.body?.message ?? 'Invalid credentials');
            throw error;
        }
    }

    async signUp({ name, email, password }: SignUpDto): Promise<SignInResponseDto> {
        try {
            await this.auth.api.signUpEmail({ body: { name, email, password } });
            return new SignInResponseDto({ redirectTo: AuthRedirectHelper.verifyEmailPath(email) });
        } catch (error) {
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Sign up failed');
            throw error;
        }
    }

    async signOut(request: Request, response: Response): Promise<SuccessResponseDto> {
        const token = request.cookies?.[SESSION_TOKEN_NAME] ?? request.cookies?.[REFRESH_TOKEN_NAME] ?? request.cookies?.[ACCESS_TOKEN_NAME];
        if (token) await this.auth.api.signOut({ headers: Utils.getHeader(token) });
        this.helper.clearCookies(response);
        return new SuccessResponseDto({ success: true });
    }

    async sendEmailOtp({ email, type }: SendEmailOtpDto): Promise<SuccessResponseDto> {
        try {
            const result = await this.auth.api.sendVerificationOTP({ body: { email, type } });
            if (!result.success) throw new BadRequestException('Failed to send OTP');
            return new SuccessResponseDto({ success: true });
        } catch (error) {
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Failed to send OTP');
            throw error;
        }
    }

    async verifyEmailOtp({ email, otp }: VerifyEmailOtpDto, response: Response): Promise<SignInResponseDto> {
        try {
            const result = await this.auth.api.verifyEmailOTP({ body: { email, otp } });
            if (!result.status) throw new UnauthorizedException('Email verification failed');
            if (!result.token) return new SignInResponseDto({ redirectTo: AuthRedirectHelper.signInPath() });
            const session = await this.auth.api.getSession({ headers: Utils.getHeader(result.token) });
            if (!session) throw new UnauthorizedException('Email verification failed');
            return await this.helper.establishSession(session, response);
        } catch (error) {
            if (isAPIError(error)) throw new UnauthorizedException(error.body?.message ?? 'Email verification failed');
            throw error;
        }
    }

    async forgotPassword({ email }: ForgotPasswordDto): Promise<SuccessResponseDto> {
        try {
            const result = await this.auth.api.requestPasswordResetEmailOTP({ body: { email } });
            if (!result.success) throw new BadRequestException('Failed to send password reset OTP');
            return new SuccessResponseDto({ success: true, redirectTo: AuthRedirectHelper.resetPasswordPath(email) });
        } catch (error) {
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Failed to send password reset OTP');
            throw error;
        }
    }

    async resetPassword({ email, otp, password }: ResetPasswordDto): Promise<SuccessResponseDto> {
        try {
            const result = await this.auth.api.resetPasswordEmailOTP({ body: { email, otp, password } });
            if (!result.success) throw new BadRequestException('Failed to reset password');
            return new SuccessResponseDto({ success: true, redirectTo: AuthRedirectHelper.signInAfterResetPath() });
        } catch (error) {
            if (isAPIError(error)) throw new BadRequestException(error.body?.message ?? 'Failed to reset password');
            throw error;
        }
    }

    async getCurrentSession(sessionToken: string): Promise<AuthUserSession | null> {
        return await this.auth.api.getSession({ headers: Utils.getHeader(sessionToken) });
    }

    /** Remint pb_access_token from a still-valid session/refresh cookie (no access JWT required). */
    async refreshAccessToken(request: Request, response: Response): Promise<SuccessResponseDto> {
        const sessionToken = request.cookies?.[SESSION_TOKEN_NAME] ?? request.cookies?.[REFRESH_TOKEN_NAME];
        if (!sessionToken) throw new UnauthorizedException('Session required');
        const session = await this.auth.api.getSession({ headers: Utils.getHeader(sessionToken) });
        if (!session) throw new UnauthorizedException('Invalid session');
        const accessToken = await this.helper.mintAccessToken(session);
        response.cookie(ACCESS_TOKEN_NAME, accessToken, { ...Utils.getCookieOptions(), maxAge: ACCESS_TOKEN_MAX_AGE });
        return new SuccessResponseDto({ success: true });
    }
}
