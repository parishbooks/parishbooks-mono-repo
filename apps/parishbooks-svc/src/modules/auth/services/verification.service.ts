import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@parishbooks/database';
import { AuthRepository } from '../repository/auth.repository';
import { VerificationRepository } from '../repository/verification.repository';
import { OTP_EXPIRES_IN_SECONDS, OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_SEND_COOLDOWN_SECONDS } from '../constants/verification.constants';
import { normalizeVerificationEmail, toEmailVerificationOtpIdentifier } from '../helpers/otp-identifier.helper';
import { formatVerificationValue, generateNumericOtp, hashOtp, splitVerificationValue, verifyOtpHash } from '../helpers/otp-crypto.helper';
import { EMAIL_SENDER, type EmailSenderPort } from '../ports/email-sender.port';
import { OtpExpiredException, OtpInvalidException, OtpRateLimitedException, UserNotFoundException } from '../exceptions';

@Injectable()
export class VerificationService {
    private readonly logger = new Logger(VerificationService.name);
    private readonly lastSendAtByEmail = new Map<string, number>();

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly verificationRepository: VerificationRepository,
        @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderPort,
    ) {}

    /** Always resolves; skips send when user is missing or already verified. */
    async sendEmailVerificationOtp(email: string): Promise<void> {
        const normalized = normalizeVerificationEmail(email);
        if (!this.isValidEmail(normalized)) return;
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user || user.emailVerified) return;
        this.enforceSendCooldown(normalized);
        const otp = generateNumericOtp(OTP_LENGTH);
        const identifier = toEmailVerificationOtpIdentifier(normalized);
        const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_SECONDS * 1000);
        const value = formatVerificationValue(hashOtp(otp), 0);
        await this.verificationRepository.upsertByIdentifier({ identifier, value, expiresAt });
        this.lastSendAtByEmail.set(normalized, Date.now());
        setImmediate(() => {
            void this.emailSender.sendEmailVerificationOtp({ email: normalized, otp }).catch((err: unknown) => {
                this.logger.error(`Failed to send verification email to ${normalized}`, err);
            });
        });
    }

    async verifyEmailOtp(email: string, otp: string): Promise<User> {
        const normalized = normalizeVerificationEmail(email);
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user) throw new UserNotFoundException();
        const identifier = toEmailVerificationOtpIdentifier(normalized);
        const row = await this.verificationRepository.findByIdentifier(identifier);
        if (!row || row.expiresAt.getTime() <= Date.now()) {
            if (row) await this.verificationRepository.deleteByIdentifier(identifier);
            throw new OtpExpiredException();
        }

        const { storedOtp, attempts } = splitVerificationValue(row.value);
        if (attempts >= OTP_MAX_ATTEMPTS) {
            await this.verificationRepository.deleteByIdentifier(identifier);
            throw new OtpRateLimitedException();
        }

        if (!verifyOtpHash(otp, storedOtp)) {
            const nextAttempts = attempts + 1;
            if (nextAttempts >= OTP_MAX_ATTEMPTS) {
                await this.verificationRepository.deleteByIdentifier(identifier);
                throw new OtpRateLimitedException();
            }
            await this.verificationRepository.upsertByIdentifier({
                identifier,
                value: formatVerificationValue(storedOtp, nextAttempts),
                expiresAt: row.expiresAt,
            });
            throw new OtpInvalidException();
        }

        await this.verificationRepository.deleteByIdentifier(identifier);
        await this.authRepository.markEmailVerified(user.id);
        user.emailVerified = true;
        return user;
    }

    private enforceSendCooldown(normalizedEmail: string) {
        const last = this.lastSendAtByEmail.get(normalizedEmail);
        if (last === undefined) return;
        const elapsedSec = (Date.now() - last) / 1000;
        if (elapsedSec < OTP_SEND_COOLDOWN_SECONDS) throw new OtpRateLimitedException('Please wait before requesting another code.');
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.length > 3;
    }
}
