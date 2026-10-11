import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from './auth-user.dto';

export enum SignInStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

export class SignInResponseDto {
    @ApiProperty({ enum: SignInStatus })
    status: SignInStatus;

    @ApiProperty({ type: String, nullable: true })
    error: string | null;

    @ApiProperty({ type: String, nullable: true })
    redirectTo: string | null;

    @ApiProperty({ type: AuthUser, nullable: true })
    data: AuthUser | null;

    constructor(fields: Partial<SignInResponseDto>) {
        Object.assign(this, fields);
    }

    static success(user: AuthUser, redirectTo: string): SignInResponseDto {
        return new SignInResponseDto({
            status: SignInStatus.SUCCESS,
            error: null,
            redirectTo: redirectTo,
            data: user,
        });
    }

    static error(error: string, redirectTo: string): SignInResponseDto {
        return new SignInResponseDto({
            status: SignInStatus.ERROR,
            redirectTo: redirectTo,
            error: error,
            data: null,
        });
    }
}
