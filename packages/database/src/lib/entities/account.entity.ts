import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum AccountProviderId {
    CREDENTIAL = 'credential',
    EMAIL = 'email',
}

@Entity('account')
@Index(['userId', 'id'])
@Unique(['providerId', 'accountId'])
export class Account extends BaseEntity {
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'text' })
    providerId!: AccountProviderId | string;

    @Column({ type: 'text', nullable: true })
    accountId?: string;

    @Column({ type: 'text', nullable: true })
    password?: string;
}
