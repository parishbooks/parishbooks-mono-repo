import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @ApiProperty({ example: 'John', description: 'User first name' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'User last name' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ example: '+15551234567', description: 'Optional phone number stored on profile' })
    @IsOptional()
    @IsString()
    phone?: string;
}
