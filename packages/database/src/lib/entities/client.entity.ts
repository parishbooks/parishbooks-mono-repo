import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';

@Entity('client')
@Unique(['userId'])
@Unique(['billingCustomerId'])
@Index(['userId'])
export class Client extends BaseEntity {
    @Column({ type: 'uuid', name: 'user_id' })
    userId!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'text', nullable: true, name: 'company_name' })
    companyName?: string;

    @Column({ type: 'text', nullable: true, name: 'billing_customer_id' })
    billingCustomerId?: string;

    @OneToMany(() => Organization, (organization) => organization.client)
    organizations!: Organization[];

    @OneToMany(() => Subscription, (subscription) => subscription.client)
    subscriptions!: Subscription[];
}
