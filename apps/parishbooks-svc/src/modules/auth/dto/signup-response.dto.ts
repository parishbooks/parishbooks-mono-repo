import { ApiProperty } from '@nestjs/swagger';

export enum SignUpStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}

export class SignUpDataDto {
    @ApiProperty({ example: 'tenant123', description: 'Tenant ID' })
    tenantId: string;

    @ApiProperty({ example: 'user123', description: 'User ID' })
    userId: string;
}

export class SignUpResponseDto {
    @ApiProperty({ enum: SignUpStatus })
    status: SignUpStatus;

    @ApiProperty({ type: String, nullable: true })
    error: string | null;

    @ApiProperty({ type: String, nullable: true })
    redirectTo: string | null;

    @ApiProperty({ type: SignUpDataDto, nullable: true })
    data: SignUpDataDto | null;

    constructor(fields: Partial<SignUpResponseDto>) {
        Object.assign(this, fields);
    }

    static success(data: SignUpDataDto, redirectTo: string): SignUpResponseDto {
        return new SignUpResponseDto({ status: SignUpStatus.SUCCESS, error: null, redirectTo, data });
    }

    static error(error: string, redirectTo: string): SignUpResponseDto {
        return new SignUpResponseDto({ status: SignUpStatus.ERROR, error: error, redirectTo: redirectTo, data: null });
    }
}
