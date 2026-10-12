#!/usr/bin/env bun
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import inquirer from 'inquirer';
import pg from 'pg';
import { databaseScriptPaths } from './lib/paths';

loadEnv({ path: join(databaseScriptPaths(import.meta).workspaceRoot, '.env') });

function quoteIdent(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
}

async function listTables(client: pg.Client, schema: string): Promise<string[]> {
    const { rows } = await client.query<{ tablename: string }>('SELECT tablename FROM pg_tables WHERE schemaname = $1 ORDER BY tablename', [schema]);
    return rows.map((row) => row.tablename);
}

async function dropSchemaTables(client: pg.Client, schema: string): Promise<{ dropped: string[]; errors: string[] }> {
    const dropped: string[] = [];
    const errors: string[] = [];
    for (const tablename of await listTables(client, schema)) {
        try {
            await client.query(`DROP TABLE IF EXISTS ${quoteIdent(schema)}.${quoteIdent(tablename)} CASCADE`);
            dropped.push(tablename);
        } catch (error) {
            errors.push(`${schema}.${tablename}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const { rows: enums } = await client.query<{ typname: string }>(
        `SELECT t.typname
         FROM pg_type t
         JOIN pg_namespace n ON n.oid = t.typnamespace
         WHERE n.nspname = $1 AND t.typtype = 'e'`,
        [schema],
    );
    for (const { typname } of enums) {
        try {
            await client.query(`DROP TYPE IF EXISTS ${quoteIdent(schema)}.${quoteIdent(typname)} CASCADE`);
        } catch (error) {
            errors.push(`${schema}.${typname}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return { dropped, errors };
}

async function recreatePublicSchema(client: pg.Client): Promise<void> {
    await client.query('DROP SCHEMA IF EXISTS public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO PUBLIC');
    await client.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('DATABASE_URL is not set (check .env).');
        process.exit(1);
    }

    const client = new pg.Client({ connectionString: databaseUrl });
    await client.connect();

    try {
        const publicTables = await listTables(client, 'public');
        const authTables = await listTables(client, 'auth');

        console.log('\nCurrent tables:');
        console.log(`  public: ${publicTables.length ? publicTables.join(', ') : '(empty)'}`);
        if (authTables.length)
            console.log(`  auth:   ${authTables.length} table(s) (e.g. ${authTables.slice(0, 3).join(', ')}${authTables.length > 3 ? ', …' : ''})`);

        const { targets } = await inquirer.prompt<{ targets: ('public' | 'auth')[] }>([
            {
                type: 'checkbox',
                name: 'targets',
                message: 'What should be wiped?',
                choices: [
                    {
                        name: 'public schema — drop all app tables, migrations history, and data (recreates empty public + uuid-ossp)',
                        value: 'public',
                        checked: true,
                    },
                    {
                        name: 'auth schema — drop Supabase GoTrue tables (often fails without postgres / service role)',
                        value: 'auth',
                        checked: false,
                    },
                ],
                validate: (value: ('public' | 'auth')[]) => (value.length > 0 ? true : 'Select at least one target'),
            },
        ]);

        const { typed } = await inquirer.prompt<{ typed: string }>([
            {
                type: 'input',
                name: 'typed',
                message: 'Type RESET to confirm irreversible data loss:',
                validate: (value: string) => (value.trim() === 'RESET' ? true : 'Enter RESET exactly'),
            },
        ]);
        if (typed.trim() !== 'RESET') process.exit(1);

        if (targets.includes('public')) {
            console.log('\nResetting public schema…');
            await recreatePublicSchema(client);
            console.log('  public: recreated (empty)');
        }

        if (targets.includes('auth')) {
            console.log('\nResetting auth schema…');
            try {
                await client.query('DROP SCHEMA IF EXISTS auth CASCADE');
                await client.query('CREATE SCHEMA auth');
                console.log('  auth: schema dropped and recreated');
            } catch (error) {
                console.warn(`  auth: DROP SCHEMA failed (${error instanceof Error ? error.message : error}); dropping tables individually…`);
                const { dropped, errors } = await dropSchemaTables(client, 'auth');
                if (dropped.length) console.log(`  auth: dropped ${dropped.length} table(s)`);
                if (errors.length) {
                    console.warn('  auth: some objects could not be dropped (use Supabase SQL editor as postgres if needed):');
                    for (const message of errors) console.warn(`    - ${message}`);
                }
            }
        }

        console.log('\nDone. No migrations were run.');
    } finally {
        await client.end();
    }
}

void main().catch((error) => {
    console.error(error);
    process.exit(1);
});
