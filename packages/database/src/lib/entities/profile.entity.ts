import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('profile')
export class Profile {
    @PrimaryColumn({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
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

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
}
