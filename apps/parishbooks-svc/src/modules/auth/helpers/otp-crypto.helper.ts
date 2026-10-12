import { createHash, timingSafeEqual } from 'node:crypto';

/** SHA-256 base64url (no padding), aligned with Better Auth default OTP hashing. */
export const hashOtp = (otp: string): string => {
    const digest = createHash('sha256').update(otp, 'utf8').digest();
    return digest.toString('base64url');
};

export const verifyOtpHash = (otp: string, storedHash: string): boolean => {
    const candidate = hashOtp(otp);
    const a = Buffer.from(candidate);
    const b = Buffer.from(storedHash);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
};

export const splitVerificationValue = (value: string): { storedOtp: string; attempts: number } => {
    const idx = value.lastIndexOf(':');
    if (idx === -1) return { storedOtp: value, attempts: 0 };
    const storedOtp = value.slice(0, idx);
    const attempts = Number.parseInt(value.slice(idx + 1), 10);
    return { storedOtp, attempts: Number.isFinite(attempts) ? attempts : 0 };
};

export const formatVerificationValue = (storedOtp: string, attempts: number): string => `${storedOtp}:${attempts}`;

export const generateNumericOtp = (length: number): string => {
    const max = 10 ** length;
    const [random] = crypto.getRandomValues(new Uint32Array(1));
    const n = (random ?? 0) % max;
    return n.toString().padStart(length, '0');
};
