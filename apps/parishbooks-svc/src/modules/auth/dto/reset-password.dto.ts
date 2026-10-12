import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: '6-digit reset code' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp: string;

    @ApiProperty({ example: 'Str0ng!Pass1' })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;
}

export class ResetPasswordResponseDto {
    @ApiProperty({ example: true })
    success: true;

    @ApiProperty({ example: '/sign-in?reset=1' })
    redirectTo: string;

    constructor(redirectTo = '/sign-in?reset=1') {
        this.success = true;
        this.redirectTo = redirectTo;
    }
}
