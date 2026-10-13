import { Inject, Injectable, Logger } from '@nestjs/common';
import { User, UserStatus } from '@parishbooks/database';
import { AuthRepository } from '../repository/auth.repository';
import { VerificationRepository } from '../repository/verification.repository';
import { FORGET_PASSWORD_OTP_TYPE, OTP_SEND_COOLDOWN_SECONDS } from '../constants/verification.constants';
import { normalizeVerificationEmail, toEmailVerificationOtpIdentifier, toForgetPasswordOtpIdentifier } from '../helpers/otp-identifier.helper';
import { issueOtpChallenge, verifyOtpChallenge } from '../helpers/otp-challenge.helper';
import { EMAIL_SENDER, type EmailSenderPort } from '../ports/email-sender.port';
import { OtpRateLimitedException, UserNotFoundException } from '../exceptions';

@Injectable()
export class VerificationService {
    private readonly logger = new Logger(VerificationService.name);
    private readonly lastSendAtByCooldownKey = new Map<string, number>();

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
        if (!user || user.status === UserStatus.ACTIVE) return;

        const identifier = toEmailVerificationOtpIdentifier(normalized);
        await this.issueOtp(normalized, 'email-verification', identifier, (target, code) =>
            this.emailSender.sendEmailVerificationOtp({ email: target, otp: code }),
        );
    }

    async verifyEmailOtp(email: string, otp: string): Promise<User> {
        const normalized = normalizeVerificationEmail(email);
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user) throw new UserNotFoundException();

        const identifier = toEmailVerificationOtpIdentifier(normalized);
        await verifyOtpChallenge(this.verificationRepository, identifier, otp);

        await this.authRepository.markEmailVerified(user.id);
        user.status = UserStatus.ACTIVE;
        return user;
    }

    /** Always resolves; skips send when no credential user exists. */
    async sendForgetPasswordOtp(email: string): Promise<void> {
        const normalized = normalizeVerificationEmail(email);
        if (!this.isValidEmail(normalized)) return;
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user) return;

        const identifier = toForgetPasswordOtpIdentifier(normalized);
        await this.issueOtp(normalized, FORGET_PASSWORD_OTP_TYPE, identifier, (target, code) =>
            this.emailSender.sendPasswordResetOtp({ email: target, otp: code }),
        );
    }

    private async issueOtp(
        normalizedEmail: string,
        cooldownScope: string,
        identifier: string,
        send: (email: string, otp: string) => Promise<void>,
    ): Promise<void> {
        this.enforceSendCooldown(cooldownScope, normalizedEmail);
        const otp = await issueOtpChallenge(this.verificationRepository, identifier);
        this.lastSendAtByCooldownKey.set(`${cooldownScope}:${normalizedEmail}`, Date.now());
        setImmediate(() => {
            void send(normalizedEmail, otp).catch((err: unknown) => {
                this.logger.error(`Failed to send OTP (${cooldownScope}) to ${normalizedEmail}`, err);
            });
        });
    }

    private enforceSendCooldown(cooldownScope: string, normalizedEmail: string) {
        const key = `${cooldownScope}:${normalizedEmail}`;
        const last = this.lastSendAtByCooldownKey.get(key);
        if (last === undefined) return;
        const elapsedSec = (Date.now() - last) / 1000;
        if (elapsedSec < OTP_SEND_COOLDOWN_SECONDS) throw new OtpRateLimitedException('Please wait before requesting another code.');
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.length > 3;
    }
}
