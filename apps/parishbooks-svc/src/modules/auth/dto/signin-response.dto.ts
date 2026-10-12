import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
    @ApiProperty({ description: 'UI path to open after sign-in' })
    redirectTo: string;

    @ApiProperty({ description: 'Access token' })
    accessToken: string;

    @ApiProperty({ description: 'Refresh token' })
    refreshToken: string;

    constructor(fields: Partial<SignInResponseDto>) {
        Object.assign(this, fields);
    }
}
