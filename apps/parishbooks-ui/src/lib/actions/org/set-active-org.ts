'use server';

import { setActiveOrganization as apiSetActiveOrganization, type SetActiveOrganizationDto } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { errorMessage } from '@/lib/utils/error-message';

export async function setActiveOrg(body: SetActiveOrganizationDto) {
    const { data, error, response } = await apiSetActiveOrganization({ body });
    if (error) throw new Error(errorMessage(error, 'Set active organization failed.'));
    if (response) await applyUpstreamCookies(response);
    return data;
}
