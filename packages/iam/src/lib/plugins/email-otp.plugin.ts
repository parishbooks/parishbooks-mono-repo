import { Logger } from '@nestjs/common';
import { emailOTP } from 'better-auth/plugins';

export class EmailOtpPlugin {
    private static logger = new Logger(EmailOtpPlugin.name);

    public static init() {
        return emailOTP({
            otpLength: 6,
            overrideDefaultEmailVerification: true,
            sendVerificationOnSignUp: true,
            sendVerificationOTP: async ({ email, otp, type }) => {
                this.logger.log(`Sending OTP for ${email} (${type}): ${otp}`);
            },
        });
    }
}
