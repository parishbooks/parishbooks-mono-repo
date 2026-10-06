import { getCurrentSessionApi, getOrganizationApi } from '@/lib/api-client';
import type { WorkspaceCountry, WorkspaceCurrency } from '@/components/church-setup-flow/constants';
import type { OrganizationProfileFormValues } from './organization-profile-form';

export type LoadedOrganizationProfile = {
    defaults: OrganizationProfileFormValues;
    updatedAt: string | null;
};

function isCountry(value: unknown): value is WorkspaceCountry {
    return value === 'IN' || value === 'US';
}

function isCurrency(value: unknown): value is WorkspaceCurrency {
    return value === 'INR' || value === 'USD';
}

function activeOrganizationIdFromSession(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;
    const session = (data as { session?: { activeOrganizationId?: unknown } }).session;
    const id = session?.activeOrganizationId;
    return typeof id === 'string' && id.length > 0 ? id : null;
}

function organizationProfileFromResponse(data: unknown): LoadedOrganizationProfile | null {
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
        defaults: {
            organizationName: org.name,
            country: profile.country,
            timezone: profile.timezone,
            currency: profile.currency,
        },
        updatedAt,
    };
}

export async function loadOrganizationProfile(): Promise<LoadedOrganizationProfile | null> {
    const { data: session, error: sessionError } = await getCurrentSessionApi();
    if (sessionError || !session) return null;
    const organizationId = activeOrganizationIdFromSession(session);
    if (!organizationId) return null;
    const { data: organization, error } = await getOrganizationApi({ path: { organizationId } });
    if (error || !organization) return null;
    return organizationProfileFromResponse(organization);
}
