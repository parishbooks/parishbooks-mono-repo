import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { ErrorResponseDto, Public } from '@parishbooks/core';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME, SESSION_TOKEN_NAME } from './constants';
import { AuthService } from './auth.service';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiOperation({ operationId: 'signIn', summary: 'Sign in with email and password' })
    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ type: SignInResponseDto, description: 'Sets pb_access_token, pb_refresh_token, and pb_session_token cookies when email is verified' })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        return this.authService.signIn(signInDto, response);
    }

    @Post('sign-up')
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiOperation({ operationId: 'signUp', summary: 'Create an account and start email verification' })
    @ApiBody({ type: SignUpDto })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async signUp(@Body() signUpDto: SignUpDto): Promise<SignInResponseDto> {
        return this.authService.signUp(signUpDto);
    }

    @Post('sign-out')
    @Public()
    @ApiOperation({ operationId: 'signOut', summary: 'Sign out and clear auth cookies' })
    @ApiCookieAuth(ACCESS_TOKEN_NAME)
    @ApiCookieAuth(REFRESH_TOKEN_NAME)
    @ApiCookieAuth(SESSION_TOKEN_NAME)
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    async signOut(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SuccessResponseDto> {
        return this.authService.signOut(request, response);
    }

    @Post('email-otp/send')
    @Public()
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOperation({ operationId: 'sendEmailOtp', summary: 'Send an email OTP' })
    @ApiBody({ type: SendEmailOtpDto })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async sendEmailOtp(@Body() dto: SendEmailOtpDto): Promise<SuccessResponseDto> {
        return this.authService.sendEmailOtp(dto);
    }

    @Post('email-otp/verify')
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiOperation({ operationId: 'verifyEmailOtp', summary: 'Verify email with OTP and establish session cookies' })
    @ApiBody({ type: VerifyEmailOtpDto })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        return this.authService.verifyEmailOtp(dto, response);
    }

    @Post('forgot-password')
    @Public()
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOperation({ operationId: 'forgotPassword', summary: 'Request a password reset OTP' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<SuccessResponseDto> {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @Public()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    @ApiOperation({ operationId: 'resetPassword', summary: 'Reset password with email OTP' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiOkResponse({ type: SuccessResponseDto })
    @ApiBadRequestResponse({ type: ErrorResponseDto })
    @ApiTooManyRequestsResponse({ type: ErrorResponseDto })
    async resetPassword(@Body() dto: ResetPasswordDto): Promise<SuccessResponseDto> {
        return this.authService.resetPassword(dto);
    }
}
