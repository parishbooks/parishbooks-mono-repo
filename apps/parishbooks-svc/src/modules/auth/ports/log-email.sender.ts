import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { Injectable, Logger } from '@nestjs/common';
import type { EmailSenderPort, SendEmailVerificationOtpPayload } from './email-sender.port';

const capturePath = () => join(process.env.E2E_OTP_CAPTURE_DIR ?? tmpdir(), 'parishbooks-e2e-otp.jsonl');

@Injectable()
export class LogEmailSender implements EmailSenderPort {
    private readonly logger = new Logger(LogEmailSender.name);

    async sendEmailVerificationOtp(payload: SendEmailVerificationOtpPayload): Promise<void> {
        this.logger.log(`Email verification OTP for ${payload.email}: ${payload.otp}`);
        if (process.env.E2E_CAPTURE_OTP !== 'true') return;
        const line = `${JSON.stringify({ email: payload.email.toLowerCase(), otp: payload.otp, at: new Date().toISOString() })}\n`;
        const path = capturePath();
        await mkdir(dirname(path), { recursive: true }).catch(() => undefined);
        await appendFile(path, line, 'utf8');
    }
}
