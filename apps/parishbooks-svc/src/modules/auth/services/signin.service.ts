import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from './password.service';
import { AccountProviderId, User } from '@parishbooks/database';
import { AuthUser } from '../dto/auth-user.dto';
import { EmailNotVerifiedException, InvalidCredentialsException, UserBannedException } from '../exceptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
    ) {}

    private getCredentialAccount(user: User) {
        const credentialAccount = user.accounts.find((account) => account.providerId === AccountProviderId.CREDENTIAL);
        if (!credentialAccount) throw new InvalidCredentialsException();
        return credentialAccount;
    }

    async signIn(email: string, password: string): Promise<AuthUser> {
        const user = await this.authRepository.getUserByEmail(email);
        if (!user) throw new InvalidCredentialsException();
        const account = this.getCredentialAccount(user);
        const isPasswordValid = await this.passwordService.compare(password, account.password);
        if (!isPasswordValid) throw new InvalidCredentialsException();
        return new AuthUser({ ...user, roles: [] });
    }

    validateUser(user: AuthUser) {
        if (user.banned) throw new UserBannedException();
        if (!user.emailVerified) throw new EmailNotVerifiedException(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return user;
    }

    mintJwt({ id, ...user }: AuthUser, rememberMe?: boolean) {
        const refreshExpiresIn = rememberMe ? '30d' : '7d';
        const accessToken = this.jwtService.sign({ sub: id, ...user });
        const refreshToken = this.jwtService.sign({ sub: id, ...user }, { expiresIn: refreshExpiresIn });
        return { accessToken, refreshToken };
    }
}
