import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User, UserStatus } from '@parishbooks/database';
import { DataSource } from 'typeorm';
import { AuthRepository } from '../repository/auth.repository';
import { VerificationRepository } from '../repository/verification.repository';
import { OTP_SEND_COOLDOWN_SECONDS } from '../constants/verification.constants';
import { OtpHelper } from '../helpers/otp.helper';
import { EMAIL_SENDER, type EmailSenderPort } from '../ports/email-sender.port';
import { OtpRateLimitedException, UserBannedException, UserNotFoundException } from '../exceptions';

@Injectable()
export class VerificationService {
    private readonly logger = new Logger(VerificationService.name);

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly verificationRepository: VerificationRepository,
        @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderPort,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

    /** Always resolves; skips send when user is missing, suspended, or already verified. */
    async sendEmailVerificationOtp(email: string): Promise<void> {
        const normalized = OtpHelper.normalizeVerificationEmail(email);
        if (!this.isValidEmail(normalized)) return;
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user || user.status !== UserStatus.PENDING) return;

        const identifier = OtpHelper.toEmailVerificationOtpIdentifier(normalized);
        await this.issueOtp(normalized, identifier, (target, code) => this.emailSender.sendEmailVerificationOtp({ email: target, otp: code }));
    }

    async verifyEmailOtp(email: string, otp: string): Promise<User> {
        const normalized = OtpHelper.normalizeVerificationEmail(email);
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user) throw new UserNotFoundException();
        if (user.status === UserStatus.SUSPENDED) throw new UserBannedException();

        const identifier = OtpHelper.toEmailVerificationOtpIdentifier(normalized);
        await this.dataSource.transaction(async (em) => {
            await OtpHelper.verifyOtpChallenge(this.verificationRepository, identifier, otp, em);
            if (user.status === UserStatus.PENDING) await this.authRepository.markEmailVerified(user.id, em);
        });
        user.status = UserStatus.ACTIVE;
        return user;
    }

    /** Always resolves; skips send when no user exists or account is suspended. */
    async sendForgetPasswordOtp(email: string): Promise<void> {
        const normalized = OtpHelper.normalizeVerificationEmail(email);
        if (!this.isValidEmail(normalized)) return;
        const user = await this.authRepository.getUserByEmail(normalized);
        if (!user || user.status === UserStatus.SUSPENDED) return;

        const identifier = OtpHelper.toForgetPasswordOtpIdentifier(normalized);
        await this.issueOtp(normalized, identifier, (target, code) => this.emailSender.sendPasswordResetOtp({ email: target, otp: code }));
    }

    private async issueOtp(normalizedEmail: string, identifier: string, send: (email: string, otp: string) => Promise<void>): Promise<void> {
        await this.enforceSendCooldown(identifier);
        const otp = await OtpHelper.issueOtpChallenge(this.verificationRepository, identifier);
        setImmediate(() => {
            void send(normalizedEmail, otp).catch((err: unknown) => {
                this.logger.error(`Failed to send OTP to ${normalizedEmail}`, err);
            });
        });
    }

    private async enforceSendCooldown(identifier: string) {
        const existing = await this.verificationRepository.findByIdentifier(identifier);
        if (!existing) return;
        const elapsedSec = (Date.now() - existing.updatedAt.getTime()) / 1000;
        if (elapsedSec < OTP_SEND_COOLDOWN_SECONDS) throw new OtpRateLimitedException('Please wait before requesting another code.');
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.length > 3;
    }
}
