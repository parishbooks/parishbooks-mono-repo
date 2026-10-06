import { getOrganizationApi } from '@/lib/api-client';
import { loadWorkspaceOrganizations } from '@/lib/utils/load-workspace-organizations';
import type { WorkspaceCountry, WorkspaceCurrency } from '@/components/church-setup-flow/constants';
import type { OrganizationProfileFormValues } from './organization-profile-form';

export type LoadedOrganizationProfile = {
    organizationId: string;
    defaults: OrganizationProfileFormValues;
    updatedAt: string | null;
};

function isCountry(value: unknown): value is WorkspaceCountry {
    return value === 'IN' || value === 'US';
}

function isCurrency(value: unknown): value is WorkspaceCurrency {
    return value === 'INR' || value === 'USD';
}

function organizationProfileFromResponse(organizationId: string, data: unknown): LoadedOrganizationProfile | null {
    if (!data || typeof data !== 'object') return null;
    const org = data as {
        name?: unknown;
        profile?: { country?: unknown; timezone?: unknown; currency?: unknown; updatedAt?: unknown };
    };
    if (typeof org.name !== 'string' || !org.name) return null;
    const profile = org.profile;
    if (!profile || !isCountry(profile.country) || !isCurrency(profile.currency)) return null;
    if (typeof profile.timezone !== 'string' || !profile.timezone) return null;
    const updatedAt = typeof profile.updatedAt === 'string' ? profile.updatedAt : profile.updatedAt instanceof Date ? profile.updatedAt.toISOString() : null;
    return {
        organizationId,
        defaults: {
            organizationName: org.name,
            country: profile.country,
            timezone: profile.timezone,
            currency: profile.currency,
        },
        updatedAt,
    };
}

/** Load profile for the org identified by the URL slug. */
export async function loadOrganizationProfile(orgSlug: string): Promise<LoadedOrganizationProfile | null> {
    const workspace = await loadWorkspaceOrganizations();
    const organization = workspace?.organizations.find((org) => org.slug === orgSlug);
    if (!organization) return null;
    const { data, error } = await getOrganizationApi({ path: { organizationId: organization.id } });
    if (error || !data) return null;
    return organizationProfileFromResponse(organization.id, data);
}
