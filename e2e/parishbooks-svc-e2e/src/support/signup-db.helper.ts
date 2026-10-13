import pg from 'pg';

export type SignUpDbState = {
    user: { email: string; status: string };
    profile: { userId: string; fullName: string | null; phone: string | null; hasPassword: boolean };
    client: { userId: string };
    memberCount: number;
    organizationCountForUser: number;
};

export async function loadSignUpDbState(userId: string, databaseUrl: string): Promise<SignUpDbState> {
    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();
    try {
        const userResult = await client.query<{ email: string; status: string }>(`SELECT email, status FROM "user" WHERE id = $1`, [userId]);
        const user = userResult.rows[0];
        if (!user) throw new Error(`user not found: ${userId}`);

        const profileResult = await client.query<{ user_id: string; full_name: string | null; phone: string | null; password: string | null }>(
            `SELECT user_id, full_name, phone, password FROM profile WHERE user_id = $1`,
            [userId],
        );
        const profileRow = profileResult.rows[0];
        if (!profileRow) throw new Error(`profile not found for user: ${userId}`);
        if (!profileRow.password) throw new Error(`profile password not set for user: ${userId}`);

        const clientResult = await client.query<{ user_id: string }>(`SELECT user_id FROM client WHERE user_id = $1`, [userId]);
        const clientRow = clientResult.rows[0];
        if (!clientRow) throw new Error(`client not found for user: ${userId}`);

        const memberResult = await client.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM member WHERE user_id = $1`, [userId]);
        const orgResult = await client.query<{ count: string }>(
            `SELECT COUNT(*)::text AS count FROM organization o
             INNER JOIN client c ON c.id = o.client_id
             WHERE c.user_id = $1`,
            [userId],
        );

        return {
            user: { email: user.email, status: user.status },
            profile: {
                userId: profileRow.user_id,
                fullName: profileRow.full_name,
                phone: profileRow.phone,
                hasPassword: true,
            },
            client: { userId: clientRow.user_id },
            memberCount: Number(memberResult.rows[0]?.count ?? 0),
            organizationCountForUser: Number(orgResult.rows[0]?.count ?? 0),
        };
    } finally {
        await client.end();
    }
}
