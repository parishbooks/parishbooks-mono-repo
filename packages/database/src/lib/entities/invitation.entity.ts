import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { InvitationStatus, MemberRole, MemberType } from '../database.enums';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('invitation')
@Index(['orgId'])
@Index('invitation_org_email_pending_uq', ['orgId', 'email'], { unique: true, where: `"status" = 'pending'` })
@Unique(['tokenHash'])
export class Invitation extends BaseEntity {
    @Column({ type: 'uuid', name: 'org_id' })
    orgId!: string;

    @ManyToOne(() => Organization, (organization) => organization.invitations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'org_id' })
    organization!: Organization;

    @Column({ type: 'citext' })
    email!: string;

    @Column({ type: 'enum', enum: MemberType, enumName: 'member_type', default: MemberType.MEMBER })
    type!: MemberType;

    @Column({ type: 'enum', enum: MemberRole, enumName: 'member_role', default: MemberRole.MEMBER })
    role!: MemberRole;

    @Column({ type: 'text', name: 'token_hash' })
    tokenHash!: string;

    @Column({ type: 'enum', enum: InvitationStatus, enumName: 'invitation_status', default: InvitationStatus.PENDING })
    status!: InvitationStatus;

    @Column({ type: 'uuid', name: 'invited_by' })
    invitedById!: string;

    @ManyToOne(() => User, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'invited_by' })
    invitedBy!: User;

    @Column({ type: 'uuid', nullable: true, name: 'accepted_by' })
    acceptedById?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'accepted_by' })
    acceptedBy?: User;

    @Column({ type: 'timestamptz', name: 'expires_at', default: () => "now() + interval '2 days'" })
    expiresAt!: Date;
}
