import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto, SendEmailOtpDto, SignInDto, SignInResponseDto, SignUpDto, SuccessResponseDto, VerifyEmailOtpDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @AllowAnonymous()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        return this.authService.signIn(signInDto, response);
    }

    @Post('sign-up')
    @AllowAnonymous()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async signUp(@Body() signUpDto: SignUpDto): Promise<SignInResponseDto> {
        return this.authService.signUp(signUpDto);
    }

    @Post('sign-out')
    @AllowAnonymous()
    async signOut(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<SuccessResponseDto> {
        return this.authService.signOut(request, response);
    }

    @Post('email-otp/send')
    @AllowAnonymous()
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    async sendEmailOtp(@Body() dto: SendEmailOtpDto): Promise<SuccessResponseDto> {
        return this.authService.sendEmailOtp(dto);
    }

    @Post('email-otp/verify')
    @AllowAnonymous()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async verifyEmailOtp(@Body() dto: VerifyEmailOtpDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        return this.authService.verifyEmailOtp(dto, response);
    }

    @Post('forgot-password')
    @AllowAnonymous()
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<SuccessResponseDto> {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @AllowAnonymous()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async resetPassword(@Body() dto: ResetPasswordDto): Promise<SuccessResponseDto> {
        return this.authService.resetPassword(dto);
    }
}
