import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BillingInterval } from '../database.enums';
import { BaseEntity } from './base.entity';
import { Subscription } from './subscription.entity';

@Entity('plan')
@Unique(['code'])
@Unique(['billingPriceId'])
export class Plan extends BaseEntity {
    @Column({ type: 'text' })
    code!: string;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'integer', default: 0, name: 'price_cents' })
    priceCents!: number;

    @Column({ type: 'enum', enum: BillingInterval, enumName: 'billing_interval', default: BillingInterval.MONTH, name: 'billing_interval' })
    billingInterval!: BillingInterval;

    @Column({ type: 'integer', nullable: true, name: 'max_orgs' })
    maxOrgs?: number;

    @Column({ type: 'integer', nullable: true, name: 'max_members_per_org' })
    maxMembersPerOrg?: number;

    @Column({ type: 'integer', nullable: true, name: 'max_staff_per_org' })
    maxStaffPerOrg?: number;

    @Column({ type: 'jsonb', default: {} })
    features!: Record<string, unknown>;

    @Column({ type: 'text', nullable: true, name: 'billing_price_id' })
    billingPriceId?: string;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive!: boolean;

    @OneToMany(() => Subscription, (subscription) => subscription.plan)
    subscriptions!: Subscription[];
}
