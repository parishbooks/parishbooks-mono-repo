import pg from 'pg';
import { expect } from 'vitest';

export async function expectTenantOwnerId(databaseUrl: string, tenantId: string, userId: string) {
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    const { rows } = await client.query<{ owner_id: string }>(`SELECT owner_id FROM tenant WHERE id = $1`, [tenantId]);
    await client.end();
    expect(rows[0]?.owner_id).toBe(userId);
}
