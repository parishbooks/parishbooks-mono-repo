import 'reflect-metadata';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const dataSourceDir = dirname(fileURLToPath(import.meta.url));
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Account } from './lib/entities/account.entity';
import { Donation } from './lib/entities/donation.entity';
import { Family } from './lib/entities/family.entity';
import { Fund } from './lib/entities/fund.entity';
import { JournalEntry } from './lib/entities/journal-entry.entity';
import { JournalLine } from './lib/entities/journal-line.entity';
import { Member } from './lib/entities/member.entity';
import { OrganizationOnboardingSubmission } from './lib/entities/organization-onboarding-submission.entity';
import { OrganizationProfile } from './lib/entities/organization-profile.entity';
import { ProcessedWebhookEvent } from './lib/entities/processed-webhook-event.entity';
import { Receipt } from './lib/entities/receipt.entity';

// Used by the TypeORM CLI only (db:generate / db:migrate). DatabaseModule is
// what services import at runtime. namingStrategy must match DatabaseModule.
loadEnv({ path: join(dataSourceDir, '../../../.env') });

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

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ENTITIES,
    migrations: [join(dataSourceDir, 'lib', 'migrations', '*.{ts,js}')],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
});
