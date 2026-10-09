import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Organization } from './organization.entity';

export enum OrganizationCountry {
    IN = 'IN',
}

export enum OrganizationPlanTier {
    STARTER = 'starter',
    PRO = 'pro',
}

export enum OrganizationCurrency {
    INR = 'INR',
}

export enum OrganizationLanguage {
    EN = 'en',
}

export enum OrganizationFiscalYear {
    JAN_DEC = 'jan_dec',
    APR_MAR = 'apr_mar',
    JUL_JUN = 'jul_jun',
}

export enum OrganizationBillingStatus {
    ACTIVE = 'active',
    PAST_DUE = 'pastDue',
    LOCKED = 'locked',
    CANCELED = 'canceled',
}

export enum OrganizationBillingProvider {
    STRIPE = 'stripe',
    CASHFREE = 'cashfree',
}

export enum CashfreeVendorStatus {
    NOT_STARTED = 'not_started',
    PENDING = 'pending',
    ACTIVE = 'active',
    REJECTED = 'rejected',
}

@Entity('organization_profile')
@Unique(['organizationId'])
export class OrganizationProfile extends BaseEntity {
    @Column({ type: 'uuid' })
    organizationId!: string;

    @OneToOne(() => Organization, (organization) => organization.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization!: Organization;

    @Column({ type: 'text' })
    legalName!: string;

    @Column({ type: 'enum', enum: OrganizationCountry, default: OrganizationCountry.IN })
    country!: OrganizationCountry;

    @Column({ type: 'boolean', default: false })
    fcraRegistered!: boolean;

    @Column({ type: 'enum', enum: OrganizationPlanTier, default: OrganizationPlanTier.STARTER })
    planTier!: OrganizationPlanTier;

    @Column({ type: 'enum', enum: OrganizationBillingStatus, default: OrganizationBillingStatus.ACTIVE })
    billingStatus!: OrganizationBillingStatus;

    @Column({ type: 'enum', enum: OrganizationBillingProvider, nullable: true })
    billingProvider?: OrganizationBillingProvider;

    @Column({ type: 'text' })
    timezone!: string;

    @Column({ type: 'enum', enum: OrganizationCurrency, default: OrganizationCurrency.INR })
    currency!: OrganizationCurrency;

    @Column({ type: 'enum', enum: OrganizationLanguage, default: OrganizationLanguage.EN })
    language!: OrganizationLanguage;

    @Column({ type: 'enum', enum: OrganizationFiscalYear, default: OrganizationFiscalYear.JAN_DEC })
    fiscalYear!: OrganizationFiscalYear;

    @Column({ type: 'text', nullable: true })
    registrationNumber?: string;

    @Column({ type: 'text', nullable: true })
    taxExemptionNumber80g?: string;

    @Column({ type: 'text', nullable: true })
    ein?: string;

    @Column({ type: 'text', nullable: true })
    cashfreeVendorId?: string;

    @Column({ type: 'enum', enum: CashfreeVendorStatus, default: CashfreeVendorStatus.NOT_STARTED })
    cashfreeVendorStatus!: CashfreeVendorStatus;

    @Column({ type: 'timestamptz', nullable: true })
    cashfreeVendorStatusAt?: Date;

    @Column({ type: 'text', nullable: true })
    cashfreeVendorRejectionReason?: string;
}
