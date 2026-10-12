import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SignUpDto } from './dto/signup.dto';
import { SignUpService } from './services/signup.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthUser } from './dto/auth-user.dto';
import { SignInService } from './services/signin.service';
import { Public } from '@parishbooks/core';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { ErrorResponseDto } from '@parishbooks/core';
import { SignInDto } from './dto/signin.dto';
import { CookieService } from './services/cookie.service';
import { TokenService } from './services/token.service';
import { RefreshTokenInvalidException } from './exceptions';
import { SendEmailVerificationDto, SendEmailVerificationResponseDto } from './dto/send-email-verification.dto';
import { VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import { VerificationService } from './services/verification.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly signInService: SignInService,
        private readonly cookieService: CookieService,
        private readonly tokenService: TokenService,
        private readonly verificationService: VerificationService,
    ) {}

    @Public()
    @Post('sign-in')
    @HttpCode(200)
    @ApiBody({ type: SignInDto })
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Email not verified or account banned', type: ErrorResponseDto })
    @UseGuards(AuthGuard('local'))
    async signIn(
        @Body() signInDto: SignInDto,
        @Req() request: Request & { user: AuthUser },
        @Res({ passthrough: true }) response: Response,
    ): Promise<SignInResponseDto> {
        const user = this.signInService.validateUser(request.user);
        const rememberMe = signInDto.rememberMe;
        const tokens = this.tokenService.mintTokenPair(user, rememberMe);
        this.cookieService.setAuthCookies(response, tokens, { rememberMe });
        return new SignInResponseDto({ ...tokens, redirectTo: '/dashboard' });
    }

    @Public()
    @Post('refresh')
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh access token', description: 'Sets a fresh pb_access_token cookie' })
    @ApiOkResponse({ type: RefreshResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token invalid or expired', type: ErrorResponseDto })
    async refreshAccessToken(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<RefreshResponseDto> {
        const refreshToken = this.cookieService.getRefreshTokenFromRequest(request);
        if (!refreshToken) throw new RefreshTokenInvalidException();
        const { accessToken } = await this.tokenService.refreshAccessToken(refreshToken);
        this.cookieService.setAccessTokenCookie(response, accessToken);
        return new RefreshResponseDto({ success: true });
    }

    @Public()
    @Post('sign-up')
    @HttpCode(201)
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiCreatedResponse({ type: SignUpResponseDto })
    @ApiResponse({ status: 400, description: 'User already exists', type: ErrorResponseDto })
    async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
        return this.signUpService.signUp(signUpDto);
    }

    @Public()
    @Throttle({ default: { limit: 3, ttl: 60_000 } })
    @Post('email-verification/send')
    @HttpCode(200)
    @ApiOperation({ summary: 'Send or resend email verification OTP' })
    @ApiBody({ type: SendEmailVerificationDto })
    @ApiOkResponse({ type: SendEmailVerificationResponseDto })
    @ApiResponse({ status: 429, description: 'Rate limited', type: ErrorResponseDto })
    async sendEmailVerification(@Body() body: SendEmailVerificationDto): Promise<SendEmailVerificationResponseDto> {
        await this.verificationService.sendEmailVerificationOtp(body.email);
        return new SendEmailVerificationResponseDto();
    }

    @Public()
    @Post('email-verification/verify')
    @HttpCode(200)
    @ApiOperation({ summary: 'Verify email with OTP and sign in' })
    @ApiBody({ type: VerifyEmailOtpDto })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: 'User not found', type: ErrorResponseDto })
    @ApiResponse({ status: 429, description: 'Too many OTP attempts', type: ErrorResponseDto })
    async verifyEmailOtp(@Body() body: VerifyEmailOtpDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        const user = await this.verificationService.verifyEmailOtp(body.email, body.otp);
        const authUser = this.signInService.validateUser(new AuthUser({ ...user, roles: [] }));
        const rememberMe = body.rememberMe;
        const tokens = this.tokenService.mintTokenPair(authUser, rememberMe);
        this.cookieService.setAuthCookies(response, tokens, { rememberMe });
        return new SignInResponseDto({ ...tokens, redirectTo: '/dashboard' });
    }
}
