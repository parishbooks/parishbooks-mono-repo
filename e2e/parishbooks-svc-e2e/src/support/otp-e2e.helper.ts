import { createHash } from 'node:crypto';
import pg from 'pg';

const EMAIL_VERIFICATION_OTP_TYPE = 'email-verification';
const FORGET_PASSWORD_OTP_TYPE = 'forget-password';

export const normalizeVerificationEmail = (email: string): string => email.trim().toLowerCase();

export const toOtpIdentifier = (type: string, email: string): string => `${type}-otp-${normalizeVerificationEmail(email)}`;

export const toEmailVerificationOtpIdentifier = (email: string): string => toOtpIdentifier(EMAIL_VERIFICATION_OTP_TYPE, email);

export const toForgetPasswordOtpIdentifier = (email: string): string => toOtpIdentifier(FORGET_PASSWORD_OTP_TYPE, email);

/** Keep in sync with apps/parishbooks-svc auth OtpHelper.hashOtp. */
export const hashOtpForE2e = (otp: string): string => createHash('sha256').update(otp, 'utf8').digest('base64url');

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function waitForVerificationRow(identifier: string, databaseUrl: string, timeoutMs = 10_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        const client = new pg.Client({ connectionString: databaseUrl });
        await client.connect();
        try {
            const result = await client.query(`SELECT 1 FROM "verification" WHERE "identifier" = $1 LIMIT 1`, [identifier]);
            if ((result.rowCount ?? 0) > 0) return;
        } finally {
            await client.end();
        }
        await sleep(25);
    }
    throw new Error(`Timed out waiting for verification row: ${identifier}`);
}

async function seedOtpByIdentifier(
    identifier: string,
    otp: string,
    databaseUrl: string,
    options?: { expiresAt?: Date; attempts?: number; updatedAt?: Date },
): Promise<void> {
    const attempts = options?.attempts ?? 0;
    const value = `${hashOtpForE2e(otp)}:${attempts}`;
    const expiresAt = options?.expiresAt ?? new Date(Date.now() + 300_000);
    const updatedAt = options?.updatedAt ?? new Date();

    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        await client.query(`DELETE FROM "verification" WHERE identifier = $1`, [identifier]);
        await client.query(
            `INSERT INTO "verification" ("identifier", "value", "expires_at", "created_at", "updated_at")
             VALUES ($1, $2, $3, $4, $4)`,
            [identifier, value, expiresAt, updatedAt],
        );
    } finally {
        await client.end();
    }
}

/** Inserts a known OTP for email verification (e2e only). */
export async function seedEmailVerificationOtp(email: string, otp: string, databaseUrl: string): Promise<void> {
    await seedOtpByIdentifier(toEmailVerificationOtpIdentifier(email), otp, databaseUrl);
}

/** After sign-up, wait for the async verification email OTP row, then replace it with a known code. */
export async function seedEmailVerificationOtpAfterSignUp(email: string, otp: string, databaseUrl: string): Promise<void> {
    const identifier = toEmailVerificationOtpIdentifier(email);
    await waitForVerificationRow(identifier, databaseUrl);
    await seedEmailVerificationOtp(email, otp, databaseUrl);
}

/** Inserts a known OTP for password reset (e2e only). */
export async function seedForgetPasswordOtp(email: string, otp: string, databaseUrl: string): Promise<void> {
    await seedOtpByIdentifier(toForgetPasswordOtpIdentifier(email), otp, databaseUrl);
}

export async function seedExpiredEmailVerificationOtp(email: string, otp: string, databaseUrl: string): Promise<void> {
    await seedOtpByIdentifier(toEmailVerificationOtpIdentifier(email), otp, databaseUrl, {
        expiresAt: new Date(Date.now() - 60_000),
    });
}

export async function seedExpiredForgetPasswordOtp(email: string, otp: string, databaseUrl: string): Promise<void> {
    await seedOtpByIdentifier(toForgetPasswordOtpIdentifier(email), otp, databaseUrl, {
        expiresAt: new Date(Date.now() - 60_000),
    });
}

/** Patches timestamps on the existing email-verification OTP row (after async sign-up has settled). */
export async function patchEmailVerificationOtpTimestamps(email: string, databaseUrl: string, patch: { expiresAt?: Date; updatedAt?: Date }): Promise<void> {
    const identifier = toEmailVerificationOtpIdentifier(email);
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        if (patch.expiresAt) await client.query(`UPDATE "verification" SET "expires_at" = $1 WHERE "identifier" = $2`, [patch.expiresAt, identifier]);
        if (patch.updatedAt) await client.query(`UPDATE "verification" SET "updated_at" = $1 WHERE "identifier" = $2`, [patch.updatedAt, identifier]);
    } finally {
        await client.end();
    }
}

/** Sets failed-attempt count on the row left by async sign-up (call after {@link seedEmailVerificationOtpAfterSignUp}). */
export async function patchEmailVerificationOtpAttempts(email: string, otp: string, attempts: number, databaseUrl: string): Promise<void> {
    const identifier = toEmailVerificationOtpIdentifier(email);
    const value = `${hashOtpForE2e(otp)}:${attempts}`;
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        const result = await client.query(`UPDATE "verification" SET "value" = $1 WHERE "identifier" = $2`, [value, identifier]);
        if ((result.rowCount ?? 0) === 0) throw new Error(`verification row not found: ${identifier}`);
    } finally {
        await client.end();
    }
}
