import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('organization_member')
@Index(['organizationId', 'id'])
@Unique(['organizationId', 'userId'])
export class OrganizationMember extends BaseEntity {
    @Column({ type: 'uuid' })
    organizationId!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => Organization, (organization) => organization.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization!: Organization;

    @ManyToOne(() => User, (user) => user.organizationMemberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'text', default: 'member' })
    role!: string;
}
