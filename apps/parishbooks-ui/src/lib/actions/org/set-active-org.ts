'use server';

import { setActiveOrganizationApi } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { errorMessage } from '@/lib/utils/error-message';

type SetActiveOrgInput = {
    organizationId?: string | null;
    organizationSlug?: string;
};

export async function setActiveOrg({ organizationId, organizationSlug }: SetActiveOrgInput) {
    const { data, error, response } = await setActiveOrganizationApi({ body: { organizationId: organizationId as never, organizationSlug } });
    if (error) throw new Error(errorMessage(error, 'Set active organization failed.'));
    if (response) await applyUpstreamCookies(response);
    return data;
}
