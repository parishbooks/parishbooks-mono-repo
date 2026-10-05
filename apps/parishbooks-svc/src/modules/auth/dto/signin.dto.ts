import { IsBoolean, IsEmail, IsIn, IsOptional, MaxLength, MinLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum RedirectTo {
    DASHBOARD = 'dashboard',
    EMAIL_VERIFICATION = 'email-verification',
    PASSWORD_RESET = 'password-reset',
    ORG_SETUP = 'org-setup',
    SIGN_IN = 'sign-in',
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value ?? true)
    rememberMe: boolean;
}

export class SignInResponseDto {
    redirectTo: RedirectTo;

    constructor(data: SignInResponseDto) {
        Object.assign(this, data);
    }
}

export class SignUpDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class SendEmailOtpDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsIn(['email-verification', 'sign-in', 'forget-password'])
    @Transform(({ value }) => value ?? 'email-verification')
    type: 'email-verification' | 'sign-in' | 'forget-password';
}

export class VerifyEmailOtpDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;
}

export class SuccessResponseDto {
    success: boolean;
    redirectTo?: RedirectTo;

    constructor(data: SuccessResponseDto) {
        Object.assign(this, data);
    }
}
