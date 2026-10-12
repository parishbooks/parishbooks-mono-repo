import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { Injectable, Logger } from '@nestjs/common';
import type { EmailSenderPort, SendEmailVerificationOtpPayload, SendPasswordResetOtpPayload } from './email-sender.port';

const capturePath = () => join(process.env.E2E_OTP_CAPTURE_DIR ?? tmpdir(), 'parishbooks-e2e-otp.jsonl');

@Injectable()
export class LogEmailSender implements EmailSenderPort {
    private readonly logger = new Logger(LogEmailSender.name);

    async sendEmailVerificationOtp(payload: SendEmailVerificationOtpPayload): Promise<void> {
        this.logger.log(`Email verification OTP for ${payload.email}: ${payload.otp}`);
        await this.captureOtp('email-verification', payload.email, payload.otp);
    }

    async sendPasswordResetOtp(payload: SendPasswordResetOtpPayload): Promise<void> {
        this.logger.log(`Password reset OTP for ${payload.email}: ${payload.otp}`);
        await this.captureOtp('forget-password', payload.email, payload.otp);
    }

    private async captureOtp(purpose: string, email: string, otp: string) {
        if (process.env.E2E_CAPTURE_OTP !== 'true') return;
        const line = `${JSON.stringify({ purpose, email: email.toLowerCase(), otp, at: new Date().toISOString() })}\n`;
        const path = capturePath();
        await mkdir(dirname(path), { recursive: true }).catch(() => undefined);
        await appendFile(path, line, 'utf8');
    }
}
