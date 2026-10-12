import { join } from 'node:path';
import type { EntitySchema } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Account } from './entities/account.entity';
import { Donation } from './entities/donation.entity';
import { Family } from './entities/family.entity';
import { Fund } from './entities/fund.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { LedgerAccount } from './entities/ledger-account.entity';
import { Member } from './entities/member.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationOnboardingSubmission } from './entities/organization-onboarding-submission.entity';
import { OrganizationProfile } from './entities/organization-profile.entity';
import { ProcessedWebhookEvent } from './entities/processed-webhook-event.entity';
import { Receipt } from './entities/receipt.entity';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

type EntityClass = abstract new (...args: never[]) => object;
type EntityClassOrSchema = EntityClass | EntitySchema;

/** Every `@Entity()` registered for Nest and TypeORM CLI — keep in sync when adding entities. */
export const typeOrmEntities: EntityClassOrSchema[] = [
    Tenant,
    Organization,
    User,
    Account,
    OrganizationMember,
    OrganizationProfile,
    OrganizationOnboardingSubmission,
    Family,
    Member,
    Fund,
    LedgerAccount,
    JournalEntry,
    JournalLine,
    Donation,
    Receipt,
    ProcessedWebhookEvent,
    Verification,
];

/** Resolved from `dist/lib` at runtime (this file compiles beside `migrations/`). */
export const typeOrmMigrations = [join(__dirname, 'migrations', '*.{ts,js}')];

export const typeOrmNamingStrategy = new SnakeNamingStrategy();
