import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import type { DatabaseModuleAsyncOptions, DatabaseModuleOptions } from './database.types';
import { Account } from './entities/account.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationProfile } from './entities/organization-profile.entity';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';

const ENTITIES = [Tenant, Organization, User, Account, OrganizationMember, OrganizationProfile];

const MIGRATIONS = [join(__dirname, 'migrations', '*.{ts,js}')];

@Module({})
export class DatabaseModule {
    static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            global: true,
            imports: [
                ...(options.imports ?? []),
                TypeOrmModule.forRootAsync({
                    imports: options.imports,
                    inject: options.inject ?? [],
                    useFactory: async (...args: unknown[]) => {
                        const config = await options.useFactory(...args);
                        return this.toTypeOrmOptions(config);
                    },
                }),
            ],
            exports: [TypeOrmModule],
        };
    }

    private static toTypeOrmOptions(config: DatabaseModuleOptions) {
        return {
            type: 'postgres' as const,
            url: config.url,
            entities: ENTITIES,
            migrations: MIGRATIONS,
            autoLoadEntities: false,
            synchronize: false,
            logging: config.logging,
            ssl: config.ssl,
            namingStrategy: new SnakeNamingStrategy(),
        };
    }
}
