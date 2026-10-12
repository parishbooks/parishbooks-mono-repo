import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ type: () => Number, example: 400 })
    statusCode: number;

    @ApiProperty({ type: () => String, example: 'Bad Request', description: 'Human-readable message, or a list of validation errors' })
    message: string | string[];

    @ApiPropertyOptional({ type: () => String, example: 'Bad Request' })
    error?: string;

    @ApiPropertyOptional({ type: () => String, example: 'EMAIL_NOT_VERIFIED', description: 'Stable machine-readable error code' })
    code?: string;

    @ApiPropertyOptional({
        type: () => String,
        example: '/verify-email?email=user@example.com',
        description: 'UI path when the client should redirect',
    })
    redirectTo?: string;

    @ApiPropertyOptional({ type: () => String, example: 'user@example.com', description: 'Context for verification or recovery flows' })
    email?: string;

    @ApiProperty({ type: () => String, example: '2026-10-05T04:00:00.000Z' })
    timestamp: string;

    @ApiProperty({ type: () => String, example: '/api/v1/auth/sign-in' })
    path: string;
}
