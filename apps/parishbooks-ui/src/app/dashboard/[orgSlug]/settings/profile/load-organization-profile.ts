import type { WorkspaceCountry, WorkspaceCurrency } from '@/components/church-setup-flow/constants';
import { workspaceOrganization } from '@/lib/stub/workspace';
import type { OrganizationProfileFormValues } from './organization-profile-form';

export type LoadedOrganizationProfile = {
    organizationId: string;
    defaults: OrganizationProfileFormValues;
    updatedAt: string | null;
};

const defaultsBySlug: Record<string, { country: WorkspaceCountry; timezone: string; currency: WorkspaceCurrency }> = {
    'grace-community-church': { country: 'IN', timezone: 'Asia/Kolkata', currency: 'INR' },
    'st-mary-parish': { country: 'IN', timezone: 'Asia/Kolkata', currency: 'INR' },
};

export function loadOrganizationProfile(orgSlug: string): LoadedOrganizationProfile {
    const organization = workspaceOrganization(orgSlug);
    const locale = defaultsBySlug[organization.slug] ?? { country: 'IN' as const, timezone: 'Asia/Kolkata', currency: 'INR' as const };
    return {
        organizationId: organization.id,
        defaults: {
            organizationName: organization.name,
            country: locale.country,
            timezone: locale.timezone,
            currency: locale.currency,
        },
        updatedAt: null,
    };
}
