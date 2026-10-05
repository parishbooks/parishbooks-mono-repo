import { Logger } from '@nestjs/common';
import { emailOTP } from 'better-auth/plugins';
import type { EmailService } from '@parishbooks/communications';

const OTP_SUBJECTS = {
    'sign-in': 'Your ParishBooks sign-in code',
    'email-verification': 'Verify your ParishBooks email',
    'forget-password': 'Reset your ParishBooks password',
    'change-email': 'Confirm your new ParishBooks email',
} as const;

export class EmailOtpPlugin {
    private static logger = new Logger(EmailOtpPlugin.name);
    private static emailService: EmailService;

    public static init(emailService: EmailService) {
        this.emailService = emailService;
        return emailOTP({
            otpLength: 6,
            overrideDefaultEmailVerification: true,
            sendVerificationOnSignUp: true,
            sendVerificationOTP: async ({ email, otp, type }) => {
                this.logger.log(`Sending OTP for ${email} (${type})`);
                await this.sendVerificationOTP({ email, otp, type });
            },
        });
    }

    private static async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: keyof typeof OTP_SUBJECTS }) {
        try {
            const text = `Your verification code is ${otp}. It expires in 5 minutes.`;
            await this.emailService.send({ to: email, subject: OTP_SUBJECTS[type], text });
        } catch (error) {
            this.logger.error(`Failed to send OTP to ${email}`, error instanceof Error ? error.stack : undefined);
        }
    }
}
