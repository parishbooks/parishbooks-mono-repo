import { Check, Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { MemberRole, MemberStatus, MemberType } from '../database.enums';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('member')
@Unique(['orgId', 'userId'])
@Index(['userId'])
@Index('member_org_active_idx', ['orgId'], { where: `"status" = 'active'` })
@Check(`("type" = 'member' AND hired_by IS NULL AND starts_at IS NULL AND ends_at IS NULL) OR ("type" = 'staff')`)
@Check(`starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at`)
export class Member extends BaseEntity {
    @Column({ type: 'uuid', name: 'org_id' })
    orgId!: string;

    @ManyToOne(() => Organization, (organization) => organization.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'org_id' })
    organization!: Organization;

    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'enum', enum: MemberType, enumName: 'member_type', default: MemberType.MEMBER })
    type!: MemberType;

    @Column({ type: 'enum', enum: MemberRole, enumName: 'member_role', default: MemberRole.MEMBER })
    role!: MemberRole;

    @Column({ type: 'enum', enum: MemberStatus, enumName: 'member_status', default: MemberStatus.ACTIVE })
    status!: MemberStatus;

    @Column({ type: 'uuid', nullable: true, name: 'invited_by' })
    invitedById?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'invited_by' })
    invitedBy?: User;

    @Column({ type: 'uuid', nullable: true, name: 'hired_by' })
    hiredById?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'hired_by' })
    hiredBy?: User;

    @Column({ type: 'timestamptz', nullable: true, name: 'starts_at' })
    startsAt?: Date;

    @Column({ type: 'timestamptz', nullable: true, name: 'ends_at' })
    endsAt?: Date;
}
