import { createHash, timingSafeEqual } from 'node:crypto';
import {
    EMAIL_VERIFICATION_OTP_TYPE,
    FORGET_PASSWORD_OTP_TYPE,
    OTP_EXPIRES_IN_SECONDS,
    OTP_LENGTH,
    OTP_MAX_ATTEMPTS,
} from '../constants/verification.constants';
import { OtpExpiredException, OtpInvalidException, OtpRateLimitedException } from '../exceptions';
import type { VerificationRepository } from '../repository/verification.repository';

export class OtpHelper {
    static normalizeAuthEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    /** @deprecated Prefer {@link OtpHelper.normalizeAuthEmail} for all auth email handling. */
    static normalizeVerificationEmail(email: string): string {
        return OtpHelper.normalizeAuthEmail(email);
    }

    /** Better Auth email-otp identifier shape: `{type}-otp-{target}`. */
    static toOtpIdentifier(type: string, email: string): string {
        return `${type}-otp-${OtpHelper.normalizeAuthEmail(email)}`;
    }

    static toEmailVerificationOtpIdentifier(email: string): string {
        return OtpHelper.toOtpIdentifier(EMAIL_VERIFICATION_OTP_TYPE, email);
    }

    static toForgetPasswordOtpIdentifier(email: string): string {
        return OtpHelper.toOtpIdentifier(FORGET_PASSWORD_OTP_TYPE, email);
    }

    /** SHA-256 base64url (no padding), aligned with Better Auth default OTP hashing. */
    static hashOtp(otp: string): string {
        const digest = createHash('sha256').update(otp, 'utf8').digest();
        return digest.toString('base64url');
    }

    static verifyOtpHash(otp: string, storedHash: string): boolean {
        const candidate = OtpHelper.hashOtp(otp);
        const a = Buffer.from(candidate);
        const b = Buffer.from(storedHash);
        if (a.length !== b.length) return false;
        return timingSafeEqual(a, b);
    }

    static splitVerificationValue(value: string): { storedOtp: string; attempts: number } {
        const idx = value.lastIndexOf(':');
        if (idx === -1) return { storedOtp: value, attempts: 0 };
        const storedOtp = value.slice(0, idx);
        const attempts = Number.parseInt(value.slice(idx + 1), 10);
        return { storedOtp, attempts: Number.isFinite(attempts) ? attempts : 0 };
    }

    static formatVerificationValue(storedOtp: string, attempts: number): string {
        return `${storedOtp}:${attempts}`;
    }

    static generateNumericOtp(length: number): string {
        const max = 10 ** length;
        const [random] = crypto.getRandomValues(new Uint32Array(1));
        const n = (random ?? 0) % max;
        return n.toString().padStart(length, '0');
    }

    static async issueOtpChallenge(verificationRepository: VerificationRepository, identifier: string): Promise<string> {
        const otp = OtpHelper.generateNumericOtp(OTP_LENGTH);
        const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_SECONDS * 1000);
        const value = OtpHelper.formatVerificationValue(OtpHelper.hashOtp(otp), 0);
        await verificationRepository.upsertByIdentifier({ identifier, value, expiresAt });
        return otp;
    }

    static async verifyOtpChallenge(verificationRepository: VerificationRepository, identifier: string, otp: string): Promise<void> {
        const row = await verificationRepository.findByIdentifier(identifier);
        if (!row || row.expiresAt.getTime() <= Date.now()) {
            if (row) await verificationRepository.deleteByIdentifier(identifier);
            throw new OtpExpiredException();
        }

        const { storedOtp, attempts } = OtpHelper.splitVerificationValue(row.value);
        if (attempts >= OTP_MAX_ATTEMPTS) {
            await verificationRepository.deleteByIdentifier(identifier);
            throw new OtpRateLimitedException();
        }

        if (!OtpHelper.verifyOtpHash(otp, storedOtp)) {
            const nextAttempts = attempts + 1;
            if (nextAttempts >= OTP_MAX_ATTEMPTS) {
                await verificationRepository.deleteByIdentifier(identifier);
                throw new OtpRateLimitedException();
            }
            await verificationRepository.upsertByIdentifier({
                identifier,
                value: OtpHelper.formatVerificationValue(storedOtp, nextAttempts),
                expiresAt: row.expiresAt,
            });
            throw new OtpInvalidException();
        }

        await verificationRepository.deleteByIdentifier(identifier);
    }
}
