import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    CashfreeVendorStatus,
    OrganizationBillingProvider,
    OrganizationBillingStatus,
    OrganizationCountry,
    OrganizationCurrency,
    OrganizationPlanTier,
} from '@parishbooks/database';

export class OrganizationProfileResponseDto {
    @ApiProperty({ format: 'uuid' })
    id!: string;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt!: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    updatedAt!: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
    deletedAt?: Date | null;

    @ApiProperty({ format: 'uuid' })
    organizationId!: string;

    @ApiProperty({ enum: OrganizationCountry, enumName: 'OrganizationCountry', example: OrganizationCountry.IN })
    country!: OrganizationCountry;

    @ApiProperty({ description: 'Whether the organization is registered under FCRA' })
    fcraRegistered!: boolean;

    @ApiProperty({ enum: OrganizationPlanTier, enumName: 'OrganizationPlanTier', example: OrganizationPlanTier.STARTER })
    planTier!: OrganizationPlanTier;

    @ApiProperty({ enum: OrganizationBillingStatus, enumName: 'OrganizationBillingStatus', example: OrganizationBillingStatus.ACTIVE })
    billingStatus!: OrganizationBillingStatus;

    @ApiPropertyOptional({ enum: OrganizationBillingProvider, enumName: 'OrganizationBillingProvider', nullable: true })
    billingProvider?: OrganizationBillingProvider | null;

    @ApiProperty({ example: 'Asia/Kolkata' })
    timezone!: string;

    @ApiProperty({ enum: OrganizationCurrency, enumName: 'OrganizationCurrency', example: OrganizationCurrency.INR })
    currency!: OrganizationCurrency;

    @ApiPropertyOptional({ type: String, nullable: true })
    registrationNumber?: string | null;

    @ApiPropertyOptional({ type: String, nullable: true, description: 'India 80G tax exemption number' })
    taxExemptionNumber80g?: string | null;

    @ApiPropertyOptional({ type: String, nullable: true, description: 'US employer identification number' })
    ein?: string | null;

    @ApiPropertyOptional({ type: String, nullable: true })
    cashfreeVendorId?: string | null;

    @ApiProperty({ enum: CashfreeVendorStatus, enumName: 'CashfreeVendorStatus', example: CashfreeVendorStatus.NOT_STARTED })
    cashfreeVendorStatus!: CashfreeVendorStatus;

    @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
    cashfreeVendorStatusAt?: Date | null;

    @ApiPropertyOptional({ type: String, nullable: true })
    cashfreeVendorRejectionReason?: string | null;
}

export class OrganizationResponseDto {
    @ApiProperty({ format: 'uuid' })
    id!: string;

    @ApiProperty({ example: 'St. Mary Parish' })
    name!: string;

    @ApiProperty({ example: 'st-mary-parish' })
    slug!: string;

    @ApiProperty({ type: String, format: 'date-time' })
    createdAt!: Date;

    @ApiPropertyOptional({ type: String, nullable: true, description: 'Organization logo URL' })
    logo?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'JSON-encoded organization metadata (timezone, country, currency)',
        example: '{"timezone":"Asia/Kolkata","country":"IN","currency":"INR"}',
    })
    metadata?: string | null;

    @ApiProperty({ type: OrganizationProfileResponseDto })
    profile!: OrganizationProfileResponseDto;
}
