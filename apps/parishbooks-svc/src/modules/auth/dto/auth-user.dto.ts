import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    tenantId: string;

    @ApiProperty({ type: Boolean })
    emailVerified: boolean;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: [String] })
    roles: string[];

    constructor(user: AuthUser) {
        this.id = user.id;
        this.email = user.email;
        this.tenantId = user.tenantId;
        this.emailVerified = user.emailVerified;
        this.username = user.username;
        this.roles = user.roles;
    }
}
