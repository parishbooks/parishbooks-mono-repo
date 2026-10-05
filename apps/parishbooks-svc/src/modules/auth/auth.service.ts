import { Injectable, UnauthorizedException } from '@nestjs/common';
import { isAPIError } from 'better-auth/api';
import { auth as authInstance } from '@parishbooks/iam';
import { AuthService as BetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import { AuthServiceHelper } from './helpers/auth-service.helper';

@Injectable()
export class AuthService {
    constructor(
        private readonly auth: BetterAuthService<typeof authInstance>,
        private readonly helper: AuthServiceHelper,
    ) {}

    async signIn({ email, password, rememberMe }: SignInDto, response: Response): Promise<SignInResponseDto> {
        try {
            const result = await this.auth.api.signInEmail({ body: { email, password, rememberMe } });
            const session = await this.auth.api.getSession({ headers: this.helper.getHeader(result.token) });
            if (!session) throw new UnauthorizedException('Invalid credentials');
            if (!session.user.emailVerified) return await this.helper.requireEmailVerification(email);
            const accessToken = await this.helper.mintAccessToken(session);
            const refreshToken = await this.helper.mintRefreshToken(session);
            this.helper.setCookies(accessToken, refreshToken, response);
            return new SignInResponseDto({ redirectTo: this.helper.determineRedirect(session) });
        } catch (error) {
            if (isAPIError(error)) throw new UnauthorizedException(error.body?.message ?? 'Invalid credentials');
            throw error;
        }
    }
}
