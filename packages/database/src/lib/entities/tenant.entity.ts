import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

export enum TenantStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
    DELETED = 'deleted',
}

@Entity('tenant')
export class Tenant extends BaseEntity {
    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.PENDING })
    status!: TenantStatus;

    /** ParishBooks account user (sign-up); DB column `owner_id`. */
    @Column({ type: 'uuid' })
    ownerId!: string;

    @ManyToOne(() => User, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'owner_id' })
    owner!: User;

    @OneToMany(() => Organization, (organization) => organization.tenant)
    organizations!: Organization[];

    @OneToMany(() => User, (user) => user.tenant)
    users!: User[];
}
