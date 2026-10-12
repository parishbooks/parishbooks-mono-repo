export type SendOtpEmailPayload = {
    email: string;
    otp: string;
};

export type SendEmailVerificationOtpPayload = SendOtpEmailPayload;
export type SendPasswordResetOtpPayload = SendOtpEmailPayload;

export interface EmailSenderPort {
    sendEmailVerificationOtp(payload: SendEmailVerificationOtpPayload): Promise<void>;
    sendPasswordResetOtp(payload: SendPasswordResetOtpPayload): Promise<void>;
}

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');
