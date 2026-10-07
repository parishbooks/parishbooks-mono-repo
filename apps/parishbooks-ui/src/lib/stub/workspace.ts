import type { OrganizationCapabilities } from '@/lib/types/organization-capabilities';

export type WorkspaceOrganization = {
    id: string;
    name: string;
    slug: string;
};

export type WorkspaceOrganizations = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
};

export const stubWorkspace: WorkspaceOrganizations = {
    activeOrganizationId: 'org_grace',
    organizations: [
        { id: 'org_grace', name: 'Grace Community Church', slug: 'grace-community-church' },
        { id: 'org_st_mary', name: 'St. Mary Parish', slug: 'st-mary-parish' },
    ],
};

export function workspaceOrganization(orgSlug: string): WorkspaceOrganization {
    const existing = stubWorkspace.organizations.find((organization) => organization.slug === orgSlug);
    if (existing) return existing;
    const name = orgSlug
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    return { id: orgSlug, name: name || orgSlug, slug: orgSlug };
}

export function stubCapabilities(organizationId: string): OrganizationCapabilities {
    return {
        organizationId,
        capabilities: {
            isKycVerified: true,
            canCollectOnlineDonations: true,
            canReceivePayouts: true,
            canRecordDonationsManually: true,
            canAddMembers: true,
            canInviteTeam: true,
            canManageFunds: true,
            canSubmitVerification: false,
        },
        verification: { status: 'active', statusAt: null, rejectionReason: null },
    };
}
