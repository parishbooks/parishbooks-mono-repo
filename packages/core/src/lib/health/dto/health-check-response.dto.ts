import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HealthCheckResponseDto {
    @ApiProperty({ example: 'ok', enum: ['ok', 'error', 'shutting_down'] })
    status: 'ok' | 'error' | 'shutting_down';

    @ApiPropertyOptional({ type: 'object', additionalProperties: true })
    info?: Record<string, unknown>;

    @ApiPropertyOptional({ type: 'object', additionalProperties: true })
    error?: Record<string, unknown>;

    @ApiProperty({ type: 'object', additionalProperties: true })
    details: Record<string, unknown>;
}
