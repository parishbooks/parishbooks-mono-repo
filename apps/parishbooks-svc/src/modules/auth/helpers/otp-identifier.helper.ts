import { EMAIL_VERIFICATION_OTP_TYPE, FORGET_PASSWORD_OTP_TYPE } from '../constants/verification.constants';

export const normalizeVerificationEmail = (email: string): string => email.trim().toLowerCase();

/** Better Auth email-otp identifier shape: `{type}-otp-{target}`. */
export const toOtpIdentifier = (type: string, email: string): string => `${type}-otp-${normalizeVerificationEmail(email)}`;

export const toEmailVerificationOtpIdentifier = (email: string): string => toOtpIdentifier(EMAIL_VERIFICATION_OTP_TYPE, email);

export const toForgetPasswordOtpIdentifier = (email: string): string => toOtpIdentifier(FORGET_PASSWORD_OTP_TYPE, email);
