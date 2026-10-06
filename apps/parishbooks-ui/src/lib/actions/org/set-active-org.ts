'use server';

import { setActiveOrganizationApi } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { errorMessage } from '@/lib/utils/error-message';

type SetActiveOrgInput = {
    organizationId?: string | null;
    organizationSlug?: string;
};

export async function setActiveOrg(body: SetActiveOrgInput) {
    const { data, error, response } = await setActiveOrganizationApi({
        body: {
            organizationId: body.organizationId as never,
            organizationSlug: body.organizationSlug,
        },
    });
    if (error) throw new Error(errorMessage(error, 'Set active organization failed.'));
    if (response) await applyUpstreamCookies(response);
    return data;
}
