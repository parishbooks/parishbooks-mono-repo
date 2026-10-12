import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendPasswordResetDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class SendPasswordResetResponseDto {
    @ApiProperty({ example: true })
    success: true;

    constructor() {
        this.success = true;
    }
}
