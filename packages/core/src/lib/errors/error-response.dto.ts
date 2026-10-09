import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], example: 'Bad Request' })
    message: string | string[];

    @ApiPropertyOptional({ example: 'Bad Request' })
    error?: string;

    @ApiProperty({ example: '2026-10-05T04:00:00.000Z' })
    timestamp: string;

    @ApiProperty({ example: '/api/v1/auth/sign-in' })
    path: string;
}
