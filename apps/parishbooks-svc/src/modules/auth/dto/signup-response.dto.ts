import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
    @ApiProperty({ description: 'UI path to open after sign-up (e.g. email verification)' })
    redirectTo: string;

    @ApiProperty({ example: 'user123' })
    userId: string;

    constructor(fields: SignUpResponseDto) {
        Object.assign(this, fields);
    }
}
