import { Body, Controller, Post, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponseDto } from './dto/signin.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @AllowAnonymous()
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        return this.authService.signIn(signInDto, response);
    }
}
