import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { typeOrmEntities, typeOrmMigrations, typeOrmNamingStrategy } from './lib/typeorm.config';

const dataSourceDir = __dirname;

loadEnv({ path: join(dataSourceDir, '../../../.env') });

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: typeOrmEntities,
    migrations: typeOrmMigrations,
    namingStrategy: typeOrmNamingStrategy,
    synchronize: false,
});
