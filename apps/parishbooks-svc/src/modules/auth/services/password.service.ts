import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repository/auth.repository';
import { VerificationRepository } from '../repository/verification.repository';
import { verifyOtpChallenge } from '../helpers/otp-challenge.helper';
import { normalizeVerificationEmail, toForgetPasswordOtpIdentifier } from '../helpers/otp-identifier.helper';
import { UserNotFoundException } from '../exceptions';

@Injectable()
export class PasswordService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly verificationRepository: VerificationRepository,
    ) {}

    async hash(password: string) {
        const salt = await bcrypt.genSalt(10);
        if (/^\$2[abxy]?\$\d+\$/.test(password)) return password;
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    async confirmPasswordReset(email: string, otp: string, newPassword: string): Promise<void> {
        const normalized = normalizeVerificationEmail(email);
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user) throw new UserNotFoundException();
        const identifier = toForgetPasswordOtpIdentifier(normalized);
        await verifyOtpChallenge(this.verificationRepository, identifier, otp);
        const passwordHash = await this.hash(newPassword);
        await this.authRepository.updateCredentialPassword(user.id, passwordHash);
    }
}
