import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { SignInService } from './services/signin.service';
import { SignUpService } from './services/signup.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signInService: SignInService,
        private readonly signUpService: SignUpService,
    ) {}

    @Post('signin')
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiBody({ type: SignInDto })
    @ApiResponse({ status: 200, description: 'Sign-in successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard('local'))
    async signIn(@Body() signInDto: SignInDto) {
        return this.signInService.signIn(signInDto.email, signInDto.password);
    }

    @Post('/signup')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'Sign-up initiated. Check email for confirmation.' })
    @ApiResponse({ status: 400, description: 'User already exists' })
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.signUpService.signUp(signUpDto);
    }
}
