import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignUpService } from './services/signup.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthUser } from './interfaces';
import { SignInService } from './services/signin.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly signInService: SignInService,
    ) {}

    @Post('signin')
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiResponse({ status: 200, description: 'Sign-in successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard('local'))
    async signIn(@Req() request: Request & { user: AuthUser }) {
        return this.signInService.validateUser(request.user);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Sign-up initiated. Check email for confirmation.' })
    @ApiResponse({ status: 400, description: 'User already exists' })
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.signUpService.signUp(signUpDto);
    }
}
