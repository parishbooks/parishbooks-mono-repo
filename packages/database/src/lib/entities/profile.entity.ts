import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('profile')
@Unique(['userId'])
export class Profile extends BaseEntity {
    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'text', nullable: true, name: 'full_name' })
    fullName?: string;

    @Column({ type: 'text', nullable: true })
    phone?: string;

    @Column({ type: 'text', nullable: true, name: 'avatar_url' })
    avatarUrl?: string;

    @Column({ type: 'text', nullable: true })
    timezone?: string;

    /** Bcrypt hash for email/password sign-in; null when the user only uses an external auth provider. */
    @Column({ type: 'text', nullable: true })
    password?: string;
}
