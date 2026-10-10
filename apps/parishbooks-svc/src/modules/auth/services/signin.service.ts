import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from './password.service';
import { AccountProviderId } from '@parishbooks/database';
import { AuthUser } from '../interfaces';

@Injectable()
export class SignInService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
    ) {}

    async signIn(email: string, password: string): Promise<AuthUser> {
        const user = await this.authRepository.getUserByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        const credentialAccount = user.accounts.find((account) => account.providerId === AccountProviderId.CREDENTIAL);
        if (!credentialAccount || !credentialAccount.password) throw new NotFoundException('Credential account not found');
        const isPasswordValid = await this.passwordService.comparePasswords(password, credentialAccount.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
        return {
            id: user.id,
            email: user.email,
            tenantId: user.tenantId,
            activeOrganizationId: null,
            emailVerified: user.emailVerified,
            username: user.username,
            roles: [],
        };
    }

    async validateUser(user: AuthUser) {
        return user;
    }
}
