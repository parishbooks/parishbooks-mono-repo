import { IsBoolean, IsEmail, IsOptional, MaxLength, MinLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum RedirectTo {
    DASHBOARD = 'dashboard',
    EMAIL_VERIFICATION = 'email-verification',
    PASSWORD_RESET = 'password-reset',
    ORG_SETUP = 'org-setup',
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
