import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefreshResponseDto {
    @ApiProperty()
    success: boolean;

    @ApiPropertyOptional({ description: 'UI path to open after this action' })
    redirectTo?: string;

    constructor(fields: Partial<RefreshResponseDto>) {
        Object.assign(this, fields);
    }
}
