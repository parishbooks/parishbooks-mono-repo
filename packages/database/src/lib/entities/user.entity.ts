import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserStatus } from '../database.enums';
import { Client } from './client.entity';
import { Member } from './member.entity';
import { Profile } from './profile.entity';

@Entity('user')
@Unique(['email'])
@Unique(['authProviderId'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @Column({ type: 'citext' })
    email!: string;

    @Column({ type: 'text', nullable: true, name: 'auth_provider_id' })
    authProviderId?: string;

    @Column({ type: 'enum', enum: UserStatus, enumName: 'user_status', default: UserStatus.ACTIVE })
    status!: UserStatus;

    @Column({ type: 'timestamptz', nullable: true, name: 'last_login_at' })
    lastLoginAt?: Date;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile?: Profile;

    @OneToOne(() => Client, (client) => client.user)
    client?: Client;

    @OneToMany(() => Member, (membership) => membership.user)
    memberships!: Member[];
}
