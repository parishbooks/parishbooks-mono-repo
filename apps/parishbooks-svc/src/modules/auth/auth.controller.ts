import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignUpService } from './services/signup.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthUser } from './dto/auth-user.dto';
import { SignInService } from './services/signin.service';
import { Public } from '@parishbooks/core';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { ErrorResponseDto } from '@parishbooks/core';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly signInService: SignInService,
    ) {}

    @Public()
    @Post('signin')
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials', type: ErrorResponseDto })
    @ApiResponse({ status: 403, description: 'Email not verified or account banned', type: ErrorResponseDto })
    @UseGuards(AuthGuard('local'))
    async signIn(@Req() request: Request & { user: AuthUser }): Promise<SignInResponseDto> {
        const user = this.signInService.validateUser(request.user);
        const tokens = this.signInService.mintJwt(user);
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
