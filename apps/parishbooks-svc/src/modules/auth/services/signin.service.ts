import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from './password.service';
import { AccountProviderId, User } from '@parishbooks/database';
import { AuthUser } from '../dto/auth-user.dto';

@Injectable()
export class SignInService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
    ) {}

    private getCredentialAccount(user: User) {
        const credentialAccount = user.accounts.find((account) => account.providerId === AccountProviderId.CREDENTIAL);
        if (!credentialAccount) throw new NotFoundException('Credential account not found');
        return credentialAccount;
    }

    async signIn(email: string, password: string): Promise<AuthUser> {
        const user = await this.authRepository.getUserByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        const account = this.getCredentialAccount(user);
        const isPasswordValid = await this.passwordService.comparePasswords(password, account.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
        return new AuthUser({
            id: user.id,
            email: user.email,
            tenantId: user.tenantId,
            emailVerified: user.emailVerified,
            username: user.username,
            roles: [],
        });
    }

    validateUser(user: AuthUser) {
        if (!user.emailVerified) throw new UnauthorizedException('Email not verified');
        return user;
    }
}
