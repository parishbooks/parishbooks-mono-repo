'use server';

import { setActiveOrganization as apiSetActiveOrganization, type SetActiveOrganizationDto } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function setActiveOrg(body: SetActiveOrganizationDto) {
    const { data, error } = await apiSetActiveOrganization({ body });
    if (error) throw new Error(errorMessage(error, 'Set active organization failed.'));
    return data;
}
