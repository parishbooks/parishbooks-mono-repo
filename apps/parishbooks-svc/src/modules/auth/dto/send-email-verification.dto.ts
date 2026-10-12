import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailVerificationDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address to verify' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class SendEmailVerificationResponseDto {
    @ApiProperty({ example: true })
    success: true;

    constructor() {
        this.success = true;
    }
}
