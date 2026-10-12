import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
    @ApiProperty({ description: 'UI path to open after this action' })
    redirectTo: string;

    @ApiProperty({ description: 'JWT access token (also set as pb_access_token httpOnly cookie)' })
    accessToken: string;

    @ApiProperty({ description: 'JWT refresh token (also set as pb_refresh_token httpOnly cookie)' })
    refreshToken: string;

    constructor(fields: Partial<SignInResponseDto>) {
        Object.assign(this, fields);
    }
}
