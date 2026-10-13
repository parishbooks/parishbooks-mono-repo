import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: true, description: 'Whether to keep the user signed in for a longer period (remember me).', required: false })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}
