import { AuthConfig } from './auth.types';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const getDatabaseConfig = (config: AuthConfig) => {
    return {
        type: 'postgres',
        schemaName: 'authentication',
        dialect: new PostgresDialect({ pool: new Pool({ connectionString: config.databaseUrl }) }),
    };
};
