import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationMember } from './organization-member.entity';
import { OrganizationProfile } from './organization-profile.entity';
import { Tenant } from './tenant.entity';

@Entity('organization')
@Index(['tenantId', 'id'])
@Unique(['tenantId', 'slug'])
export class Organization extends BaseEntity {
    @Column({ type: 'uuid' })
    tenantId!: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.organizations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    slug!: string;

    @OneToOne(() => OrganizationProfile, (profile) => profile.organization)
    profile?: OrganizationProfile;

    @OneToMany(() => OrganizationMember, (member) => member.organization)
    members!: OrganizationMember[];
}
