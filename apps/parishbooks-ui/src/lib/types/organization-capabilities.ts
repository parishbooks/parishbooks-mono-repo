export type OrganizationVerificationStatus = 'not_started' | 'pending' | 'active' | 'rejected';

export type OrganizationCapabilitiesFlags = {
    isKycVerified: boolean;
    canCollectOnlineDonations: boolean;
    canReceivePayouts: boolean;
    canRecordDonationsManually: boolean;
    canAddMembers: boolean;
    canInviteTeam: boolean;
    canManageFunds: boolean;
    canSubmitVerification: boolean;
};

export type OrganizationVerificationSummary = {
    status: OrganizationVerificationStatus;
    statusAt: string | null;
    rejectionReason: string | null;
};

export type OrganizationCapabilities = {
    organizationId: string;
    capabilities: OrganizationCapabilitiesFlags;
    verification: OrganizationVerificationSummary;
};
