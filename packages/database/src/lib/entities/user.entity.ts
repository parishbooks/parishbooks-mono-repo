import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Account } from './account.entity';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';
import { Tenant } from './tenant.entity';

@Entity('user')
@Index(['tenantId', 'id'])
@Unique(['tenantId', 'email'])
export class User extends BaseEntity {
    @Column({ type: 'uuid' })
    tenantId!: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'text', nullable: true })
    name?: string;

    @Column({ type: 'boolean', default: false })
    emailVerified!: boolean;

    @OneToMany(() => Account, (account) => account.user)
    accounts!: Account[];

    @OneToMany(() => OrganizationMember, (membership) => membership.user)
    organizationMemberships!: OrganizationMember[];
}
