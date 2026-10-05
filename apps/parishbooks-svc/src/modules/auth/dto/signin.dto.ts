import { IsBoolean, IsEmail, IsIn, IsOptional, MaxLength, MinLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RedirectTo {
    DASHBOARD = 'dashboard',
    EMAIL_VERIFICATION = 'email-verification',
    PASSWORD_RESET = 'password-reset',
    ORG_SETUP = 'org-setup',
    SIGN_IN = 'sign-in',
}

export class SignInDto {
    @ApiProperty({ example: 'admin@parishbooks.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8, maxLength: 128, example: 'password123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value ?? true)
    rememberMe: boolean;
}

export class SignInResponseDto {
    @ApiProperty({ enum: RedirectTo, enumName: 'RedirectTo' })
    redirectTo: RedirectTo;

    constructor(data: SignInResponseDto) {
        Object.assign(this, data);
    }
}

export class SignUpDto {
    @ApiProperty({ example: 'Jane Doe', minLength: 1, maxLength: 100 })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'jane@parishbooks.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8, maxLength: 128, example: 'password123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class SendEmailOtpDto {
    @ApiProperty({ example: 'jane@parishbooks.com' })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ enum: ['email-verification', 'sign-in', 'forget-password'], default: 'email-verification' })
    @IsOptional()
    @IsIn(['email-verification', 'sign-in', 'forget-password'])
    @Transform(({ value }) => value ?? 'email-verification')
    type: 'email-verification' | 'sign-in' | 'forget-password';
}

export class VerifyEmailOtpDto {
    @ApiProperty({ example: 'jane@parishbooks.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 6, maxLength: 6, example: '123456' })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'jane@parishbooks.com' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'jane@parishbooks.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 6, maxLength: 6, example: '123456' })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string;

    @ApiProperty({ minLength: 8, maxLength: 128, example: 'newpassword123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class SuccessResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiPropertyOptional({ enum: RedirectTo, enumName: 'RedirectTo' })
    redirectTo?: RedirectTo;

    constructor(data: SuccessResponseDto) {
        Object.assign(this, data);
    }
}
