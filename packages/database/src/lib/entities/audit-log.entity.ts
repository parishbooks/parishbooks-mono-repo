import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('audit_log')
@Index(['orgId', 'createdAt'])
@Index(['clientId'])
@Index(['actorId'])
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @Column({ type: 'uuid', nullable: true, name: 'client_id' })
    clientId?: string;

    @ManyToOne(() => Client, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'client_id' })
    client?: Client;

    @Column({ type: 'uuid', nullable: true, name: 'org_id' })
    orgId?: string;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'org_id' })
    organization?: Organization;

    @Column({ type: 'uuid', nullable: true, name: 'actor_id' })
    actorId?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'actor_id' })
    actor?: User;

    @Column({ type: 'text' })
    action!: string;

    @Column({ type: 'jsonb', nullable: true })
    target?: Record<string, unknown>;
}
