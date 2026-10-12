export const EMAIL_VERIFICATION_OTP_TYPE = 'email-verification';

export const OTP_LENGTH = 6;
export const OTP_EXPIRES_IN_SECONDS = 300;
export const OTP_MAX_ATTEMPTS = 3;

/** Min seconds between send/resend for the same email (service-level). */
export const OTP_SEND_COOLDOWN_SECONDS = 60;
