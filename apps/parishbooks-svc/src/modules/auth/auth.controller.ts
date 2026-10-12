import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignUpService } from './services/signup.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthUser } from './dto/auth-user.dto';
import { SignInService } from './services/signin.service';
import { Public } from '@parishbooks/core';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { ErrorResponseDto } from '@parishbooks/core';
import { SignInDto } from './dto/signin.dto';
import { CookieService } from './services/cookie.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly signInService: SignInService,
        private readonly cookieService: CookieService,
    ) {}

    @Public()
    @Post('signin')
    @ApiBody({ type: SignInDto })
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Email not verified or account banned', type: ErrorResponseDto })
    @UseGuards(AuthGuard('local'))
    async signIn(@Req() request: Request & { user: AuthUser; body: SignInDto }, @Res({ passthrough: true }) response: Response): Promise<SignInResponseDto> {
        const user = this.signInService.validateUser(request.user);
        const rememberMe = request.body?.rememberMe;
        const tokens = this.signInService.mintJwt(user, rememberMe);
        this.cookieService.setAuthCookies(response, tokens, { rememberMe });
        return new SignInResponseDto({ ...tokens, redirectTo: '/dashboard' });
    }

    @Public()
    @Post('signup')
    @HttpCode(201)
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiCreatedResponse({ type: SignUpResponseDto })
    @ApiResponse({ status: 400, description: 'User already exists', type: ErrorResponseDto })
    async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
        return this.signUpService.signUp(signUpDto);
    }
}
