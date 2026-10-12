export type SendEmailVerificationOtpPayload = {
    email: string;
    otp: string;
};

export interface EmailSenderPort {
    sendEmailVerificationOtp(payload: SendEmailVerificationOtpPayload): Promise<void>;
}

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');
