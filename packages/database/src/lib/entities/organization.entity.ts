import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Client } from './client.entity';
import { Invitation } from './invitation.entity';
import { Member } from './member.entity';
import { User } from './user.entity';

@Entity('organization')
@Unique(['slug'])
@Index(['clientId'])
export class Organization extends BaseEntity {
    @Column({ type: 'uuid', name: 'client_id' })
    clientId!: string;

    @ManyToOne(() => Client, (client) => client.organizations, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'client_id' })
    client!: Client;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'citext' })
    slug!: string;

    @Column({ type: 'jsonb', default: {} })
    settings!: Record<string, unknown>;

    @Column({ type: 'uuid', nullable: true, name: 'created_by' })
    createdById?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'created_by' })
    createdBy?: User;

    @OneToMany(() => Member, (member) => member.organization)
    members!: Member[];

    @OneToMany(() => Invitation, (invitation) => invitation.organization)
    invitations!: Invitation[];
}
