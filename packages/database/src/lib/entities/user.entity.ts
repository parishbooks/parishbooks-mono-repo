import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Account } from './account.entity';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';
import { Tenant } from './tenant.entity';

export function usernameFromEmailLocalPart(email: string): string {
    const local = email.trim().split('@')[0]?.trim() ?? '';
    const normalized = local.toLowerCase();
    return normalized.length > 0 ? normalized : 'user';
}

@Entity('user')
@Index(['tenantId', 'id'])
@Unique(['tenantId', 'email'])
@Unique(['tenantId', 'username'])
export class User extends BaseEntity {
    @Column({ type: 'uuid' })
    tenantId!: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'text' })
    username!: string;

    @Column({ type: 'text', nullable: true })
    name?: string;

    @Column({ type: 'boolean', default: false })
    emailVerified!: boolean;

    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[];

    @OneToMany(() => OrganizationMember, (membership) => membership.user)
    organizationMemberships!: OrganizationMember[];

    @BeforeInsert()
    assignUsernameFromEmail(): void {
        if (this.username?.trim()) return;
        this.username = usernameFromEmailLocalPart(this.email);
    }
}
