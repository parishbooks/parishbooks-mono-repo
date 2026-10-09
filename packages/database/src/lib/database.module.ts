import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import type { DatabaseModuleAsyncOptions, DatabaseModuleOptions } from './database.types';
import { Account } from './entities/account.entity';
import { Donation } from './entities/donation.entity';
import { Family } from './entities/family.entity';
import { Fund } from './entities/fund.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { Member } from './entities/member.entity';
import { OrganizationOnboardingSubmission } from './entities/organization-onboarding-submission.entity';
import { OrganizationProfile } from './entities/organization-profile.entity';
import { ProcessedWebhookEvent } from './entities/processed-webhook-event.entity';
import { Receipt } from './entities/receipt.entity';

// Explicit list — webpack/Nx bundles leave no loose `entities/` files for globs.
const ENTITIES = [
    OrganizationProfile,
    OrganizationOnboardingSubmission,
    Family,
    Member,
    Fund,
    Account,
    JournalEntry,
    JournalLine,
    Donation,
    Receipt,
    ProcessedWebhookEvent,
];

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
