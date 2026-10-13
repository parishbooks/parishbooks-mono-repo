import pg from 'pg';

export function requireDatabaseUrl(): string {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL is required');
    return databaseUrl;
}

export async function setUserStatus(userId: string, status: 'active' | 'pending' | 'suspended', databaseUrl: string): Promise<void> {
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        await client.query(`UPDATE "user" SET "status" = $1 WHERE "id" = $2`, [status, userId]);
    } finally {
        await client.end();
    }
}

export async function softDeleteUser(userId: string, databaseUrl: string): Promise<void> {
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        await client.query(`UPDATE "user" SET "deleted_at" = NOW() WHERE "id" = $1`, [userId]);
    } finally {
        await client.end();
    }
}

/** Reads a cookie value from a Set-Cookie header array (supertest). */
export function getCookieValue(setCookie: string[] | undefined, name: string): string | undefined {
    if (!setCookie) return undefined;
    const prefix = `${name}=`;
    for (const part of setCookie) {
        const segment = part.split(';')[0]?.trim();
        if (segment?.startsWith(prefix)) return segment.slice(prefix.length);
    }
    return undefined;
}
