'use server';

import { getOrganizationApi, OrganizationResponseDto } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function getOrganization(organizationId: string): Promise<OrganizationResponseDto> {
    const { data, error } = await getOrganizationApi({ path: { organizationId } });
    if (error) throw new Error(errorMessage(error, 'Get organization failed.'));
    return data;
}
