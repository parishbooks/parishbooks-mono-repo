import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { PasswordService } from './password.service';
import { AuthUserHelper } from '../helpers/auth-user.helper';
import { OtpHelper } from '../helpers/otp.helper';
import { EmailNotVerifiedException, InvalidCredentialsException, UserBannedException } from '../exceptions';

@Injectable()
export class SignInService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
    ) {}

    async signIn(email: string, password: string) {
        const user = await this.authRepository.getUserByEmail(OtpHelper.normalizeAuthEmail(email));
        if (!user) throw new InvalidCredentialsException();
        const passwordHash = await this.authRepository.getCredentialHash(user.id);
        if (!passwordHash) throw new InvalidCredentialsException();
        const isPasswordValid = await this.passwordService.compare(password, passwordHash);
        if (!isPasswordValid) throw new InvalidCredentialsException();
        return AuthUserHelper.toAuthUser(user);
    }

    validateUser(user: ReturnType<typeof AuthUserHelper.toAuthUser>) {
        if (user.banned) throw new UserBannedException();
        if (!user.emailVerified) throw new EmailNotVerifiedException(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return user;
    }
}
