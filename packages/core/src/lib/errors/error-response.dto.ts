import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], example: 'Bad Request' })
    message: string | string[];

    @ApiPropertyOptional({ example: 'Bad Request' })
    error?: string;

    @ApiPropertyOptional({ example: 'EMAIL_NOT_VERIFIED', description: 'Stable machine-readable error code' })
    code?: string;

    @ApiPropertyOptional({ example: '/verify-email?email=user@example.com', description: 'UI path when the client should redirect' })
    redirectTo?: string;

    @ApiPropertyOptional({ example: 'user@example.com', description: 'Context for verification or recovery flows' })
    email?: string;

    @ApiProperty({ example: '2026-10-05T04:00:00.000Z' })
    timestamp: string;

    @ApiProperty({ example: '/api/v1/auth/sign-in' })
    path: string;
}
