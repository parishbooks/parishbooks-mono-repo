import { join } from 'node:path';
import type { EntitySchema } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuditLog } from './entities/audit-log.entity';
import { Client } from './entities/client.entity';
import { Invitation } from './entities/invitation.entity';
import { Member } from './entities/member.entity';
import { Organization } from './entities/organization.entity';
import { Plan } from './entities/plan.entity';
import { Profile } from './entities/profile.entity';
import { Subscription } from './entities/subscription.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

type EntityClass = abstract new (...args: never[]) => object;
type EntityClassOrSchema = EntityClass | EntitySchema;

/** Every `@Entity()` registered for Nest and TypeORM CLI — keep in sync when adding entities. */
export const typeOrmEntities: EntityClassOrSchema[] = [User, Profile, Client, Plan, Subscription, Organization, Member, Invitation, AuditLog, Verification];

/** Resolved from `dist/lib` at runtime (this file compiles beside `migrations/`). */
export const typeOrmMigrations = [join(__dirname, 'migrations', '*.{ts,js}')];

export const typeOrmNamingStrategy = new SnakeNamingStrategy();
