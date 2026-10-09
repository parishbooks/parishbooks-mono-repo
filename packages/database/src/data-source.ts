import 'reflect-metadata';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Account } from './lib/entities/account.entity';
import { Organization } from './lib/entities/organization.entity';
import { OrganizationMember } from './lib/entities/organization-member.entity';
import { OrganizationProfile } from './lib/entities/organization-profile.entity';
import { Tenant } from './lib/entities/tenant.entity';
import { User } from './lib/entities/user.entity';

const dataSourceDir = __dirname;

loadEnv({ path: join(dataSourceDir, '../../../.env') });

const ENTITIES = [Tenant, Organization, User, Account, OrganizationMember, OrganizationProfile];

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ENTITIES,
    migrations: [join(dataSourceDir, 'lib', 'migrations', '*.{ts,js}')],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
});
