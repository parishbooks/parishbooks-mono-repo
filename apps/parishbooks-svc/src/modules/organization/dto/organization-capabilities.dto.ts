import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CashfreeVendorStatus, OrganizationBillingStatus, OrganizationProfile } from '@parishbooks/database';

export enum OrganizationVerificationStatus {
    NOT_STARTED = 'not_started',
    PENDING = 'pending',
    ACTIVE = 'active',
    REJECTED = 'rejected',
}

export class OrganizationCapabilitiesFlagsDto {
    @ApiProperty()
    isKycVerified!: boolean;

    @ApiProperty()
    canCollectOnlineDonations!: boolean;

    @ApiProperty()
    canReceivePayouts!: boolean;

    @ApiProperty()
    canRecordDonationsManually!: boolean;

    @ApiProperty()
    canAddMembers!: boolean;

    @ApiProperty()
    canInviteTeam!: boolean;

    @ApiProperty()
    canManageFunds!: boolean;

    @ApiProperty()
    canSubmitVerification!: boolean;
}

export class OrganizationVerificationSummaryDto {
    @ApiProperty({ enum: OrganizationVerificationStatus, enumName: 'OrganizationVerificationStatus' })
    status!: OrganizationVerificationStatus;

    @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
    statusAt?: Date | null;

    @ApiPropertyOptional({ nullable: true })
    rejectionReason?: string | null;
}

export class OrganizationCapabilitiesResponseDto {
    @ApiProperty({ format: 'uuid' })
    organizationId!: string;

    @ApiProperty({ type: OrganizationCapabilitiesFlagsDto })
    capabilities!: OrganizationCapabilitiesFlagsDto;

    @ApiProperty({ type: OrganizationVerificationSummaryDto })
    verification!: OrganizationVerificationSummaryDto;

    constructor(data: OrganizationCapabilitiesResponseDto) {
        Object.assign(this, data);
    }

    static fromProfile(organizationId: string, profile: OrganizationProfile): OrganizationCapabilitiesResponseDto {
        const billingUnlocked = profile.billingStatus !== OrganizationBillingStatus.LOCKED;
        const isKycVerified = profile.cashfreeVendorStatus === CashfreeVendorStatus.ACTIVE;
        const paymentsEnabled = isKycVerified && profile.billingStatus === OrganizationBillingStatus.ACTIVE;
        const canSubmitVerification =
            profile.cashfreeVendorStatus === CashfreeVendorStatus.NOT_STARTED || profile.cashfreeVendorStatus === CashfreeVendorStatus.REJECTED;

        const verificationStatus = mapVerificationStatus(profile.cashfreeVendorStatus);

        return new OrganizationCapabilitiesResponseDto({
            organizationId,
            capabilities: {
                isKycVerified,
                canCollectOnlineDonations: paymentsEnabled,
                canReceivePayouts: paymentsEnabled,
                canRecordDonationsManually: billingUnlocked,
                canAddMembers: billingUnlocked,
                canInviteTeam: billingUnlocked,
                canManageFunds: billingUnlocked,
                canSubmitVerification,
            },
            verification: {
                status: verificationStatus,
                statusAt: profile.cashfreeVendorStatusAt ?? null,
                rejectionReason: profile.cashfreeVendorRejectionReason ?? null,
            },
        });
    }
}

function mapVerificationStatus(status: CashfreeVendorStatus): OrganizationVerificationStatus {
    switch (status) {
        case CashfreeVendorStatus.PENDING:
            return OrganizationVerificationStatus.PENDING;
        case CashfreeVendorStatus.ACTIVE:
            return OrganizationVerificationStatus.ACTIVE;
        case CashfreeVendorStatus.REJECTED:
            return OrganizationVerificationStatus.REJECTED;
        default:
            return OrganizationVerificationStatus.NOT_STARTED;
    }
}
