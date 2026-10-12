import { OTP_EXPIRES_IN_SECONDS, OTP_LENGTH, OTP_MAX_ATTEMPTS } from '../constants/verification.constants';
import type { VerificationRepository } from '../repository/verification.repository';
import { formatVerificationValue, generateNumericOtp, hashOtp, splitVerificationValue, verifyOtpHash } from './otp-crypto.helper';
import { OtpExpiredException, OtpInvalidException, OtpRateLimitedException } from '../exceptions';

export const issueOtpChallenge = async (verificationRepository: VerificationRepository, identifier: string): Promise<string> => {
    const otp = generateNumericOtp(OTP_LENGTH);
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_SECONDS * 1000);
    const value = formatVerificationValue(hashOtp(otp), 0);
    await verificationRepository.upsertByIdentifier({ identifier, value, expiresAt });
    return otp;
};

export const verifyOtpChallenge = async (verificationRepository: VerificationRepository, identifier: string, otp: string): Promise<void> => {
    const row = await verificationRepository.findByIdentifier(identifier);
    if (!row || row.expiresAt.getTime() <= Date.now()) {
        if (row) await verificationRepository.deleteByIdentifier(identifier);
        throw new OtpExpiredException();
    }

    const { storedOtp, attempts } = splitVerificationValue(row.value);
    if (attempts >= OTP_MAX_ATTEMPTS) {
        await verificationRepository.deleteByIdentifier(identifier);
        throw new OtpRateLimitedException();
    }

    if (!verifyOtpHash(otp, storedOtp)) {
        const nextAttempts = attempts + 1;
        if (nextAttempts >= OTP_MAX_ATTEMPTS) {
            await verificationRepository.deleteByIdentifier(identifier);
            throw new OtpRateLimitedException();
        }
        await verificationRepository.upsertByIdentifier({
            identifier,
            value: formatVerificationValue(storedOtp, nextAttempts),
            expiresAt: row.expiresAt,
        });
        throw new OtpInvalidException();
    }

    await verificationRepository.deleteByIdentifier(identifier);
};
