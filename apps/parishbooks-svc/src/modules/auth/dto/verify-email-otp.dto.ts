import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class VerifyEmailOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: '6-digit verification code' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp: string;

    @ApiProperty({ required: false, description: 'Keep the session active longer when true' })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}
