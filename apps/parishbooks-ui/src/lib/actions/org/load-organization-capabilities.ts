'use server';

import { cache } from 'react';
import { getOrganizationCapabilitiesApi } from '@/lib/api-client';
import type { OrganizationCapabilities, OrganizationVerificationStatus } from '@/lib/types/organization-capabilities';

const verificationStatuses: OrganizationVerificationStatus[] = ['not_started', 'pending', 'active', 'rejected'];

function isVerificationStatus(value: unknown): value is OrganizationVerificationStatus {
    return typeof value === 'string' && verificationStatuses.includes(value as OrganizationVerificationStatus);
}

function capabilitiesFromResponse(organizationId: string, data: unknown): OrganizationCapabilities | null {
    if (!data || typeof data !== 'object') return null;
    const payload = data as {
        organizationId?: unknown;
        capabilities?: Record<string, unknown>;
        verification?: Record<string, unknown>;
    };
    if (payload.organizationId !== organizationId) return null;
    const caps = payload.capabilities;
    const verification = payload.verification;
    if (!caps || typeof caps !== 'object' || !verification || typeof verification !== 'object') return null;
    if (!isVerificationStatus(verification.status)) return null;

    const bool = (key: string) => caps[key] === true;

    return {
        organizationId,
        capabilities: {
            isKycVerified: bool('isKycVerified'),
            canCollectOnlineDonations: bool('canCollectOnlineDonations'),
            canReceivePayouts: bool('canReceivePayouts'),
            canRecordDonationsManually: bool('canRecordDonationsManually'),
            canAddMembers: bool('canAddMembers'),
            canInviteTeam: bool('canInviteTeam'),
            canManageFunds: bool('canManageFunds'),
            canSubmitVerification: bool('canSubmitVerification'),
        },
        verification: {
            status: verification.status,
            statusAt: typeof verification.statusAt === 'string' ? verification.statusAt : null,
            rejectionReason: typeof verification.rejectionReason === 'string' ? verification.rejectionReason : null,
        },
    };
}

export const loadOrganizationCapabilities = cache(async (organizationId: string): Promise<OrganizationCapabilities | null> => {
    const { data, error } = await getOrganizationCapabilitiesApi({ path: { organizationId } });
    if (error || !data) return null;
    return capabilitiesFromResponse(organizationId, data);
});
