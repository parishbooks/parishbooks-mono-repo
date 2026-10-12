import { EMAIL_VERIFICATION_OTP_TYPE } from '../constants/verification.constants';

/** Better Auth email-otp identifier shape: `{type}-otp-{target}`. */
export const toEmailVerificationOtpIdentifier = (email: string): string => `${EMAIL_VERIFICATION_OTP_TYPE}-otp-${normalizeVerificationEmail(email)}`;

export const normalizeVerificationEmail = (email: string): string => email.trim().toLowerCase();
