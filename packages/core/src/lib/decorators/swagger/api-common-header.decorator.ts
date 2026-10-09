import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiCommonHeader() {
    return applyDecorators(
        ApiHeader({
            name: 'Authorization',
            description: "Value must be 'Bearer <token>'",
            schema: { type: 'string', example: 'Bearer <token>' },
            required: true,
        }),
    );
}
