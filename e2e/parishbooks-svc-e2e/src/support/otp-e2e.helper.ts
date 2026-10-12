import { createHash } from 'node:crypto';
import pg from 'pg';

const EMAIL_VERIFICATION_OTP_TYPE = 'email-verification';

export const normalizeVerificationEmail = (email: string): string => email.trim().toLowerCase();

export const toEmailVerificationOtpIdentifier = (email: string): string => `${EMAIL_VERIFICATION_OTP_TYPE}-otp-${normalizeVerificationEmail(email)}`;

/** Keep in sync with apps/parishbooks-svc auth otp-crypto.helper hashOtp. */
export const hashOtpForE2e = (otp: string): string => createHash('sha256').update(otp, 'utf8').digest('base64url');

/** Inserts a known OTP for email verification (e2e only). */
export async function seedEmailVerificationOtp(email: string, otp: string, databaseUrl: string): Promise<void> {
    const identifier = toEmailVerificationOtpIdentifier(email);
    const value = `${hashOtpForE2e(otp)}:0`;
    const expiresAt = new Date(Date.now() + 300_000);

    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        await client.query(`DELETE FROM "verification" WHERE identifier = $1`, [identifier]);
        await client.query(
            `INSERT INTO "verification" ("identifier", "value", "expires_at", "created_at", "updated_at")
             VALUES ($1, $2, $3, NOW(), NOW())`,
            [identifier, value, expiresAt],
        );
    } finally {
        await client.end();
    }
}
