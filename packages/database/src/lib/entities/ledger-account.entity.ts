import { Column, Entity, Index, Unique } from 'typeorm';
import { OrganizationScopedEntity } from './organization-scoped.entity';

export enum LedgerAccountType {
    ASSET = 'asset',
    LIABILITY = 'liability',
    EQUITY = 'equity',
    INCOME = 'income',
    EXPENSE = 'expense',
}

// Chart of accounts — retired via isActive, never deleted once referenced by a journal line.
@Entity('ledger_account')
@Index(['organizationId', 'id'])
@Unique(['organizationId', 'code'])
export class LedgerAccount extends OrganizationScopedEntity {
    @Column({ type: 'text' })
    code!: string;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'enum', enum: LedgerAccountType })
    type!: LedgerAccountType;

    @Column({ type: 'uuid', nullable: true })
    parentAccountId?: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;
}
