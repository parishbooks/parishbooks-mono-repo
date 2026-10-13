import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { SubscriptionStatus } from '../database.enums';
import { UuidEntity } from './base.entity';
import { Client } from './client.entity';
import { Plan } from './plan.entity';

@Entity('subscription')
@Index(['clientId'])
@Index(['planId'])
@Index('subscription_client_live_uq', ['clientId'], {
    unique: true,
    where: `"status" IN ('trialing','active','past_due','paused')`,
})
@Unique(['billingSubscriptionId'])
export class Subscription extends UuidEntity {
    @Column({ type: 'uuid', name: 'client_id' })
    clientId!: string;

    @ManyToOne(() => Client, (client) => client.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client!: Client;

    @Column({ type: 'uuid', name: 'plan_id' })
    planId!: string;

    @ManyToOne(() => Plan, (plan) => plan.subscriptions, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'plan_id' })
    plan!: Plan;

    @Column({ type: 'enum', enum: SubscriptionStatus, enumName: 'subscription_status' })
    status!: SubscriptionStatus;

    @Column({ type: 'timestamptz', nullable: true, name: 'current_period_start' })
    currentPeriodStart?: Date;

    @Column({ type: 'timestamptz', nullable: true, name: 'current_period_end' })
    currentPeriodEnd?: Date;

    @Column({ type: 'boolean', default: false, name: 'cancel_at_period_end' })
    cancelAtPeriodEnd!: boolean;

    @Column({ type: 'timestamptz', nullable: true, name: 'trial_ends_at' })
    trialEndsAt?: Date;

    @Column({ type: 'text', nullable: true, name: 'billing_subscription_id' })
    billingSubscriptionId?: string;
}
