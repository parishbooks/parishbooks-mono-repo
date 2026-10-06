'use server';

import { createOrganizationApi, type CreateOrganizationDto } from '@/lib/api-client';
import { errorMessage } from '@/lib/utils/error-message';

export async function createOrg(body: CreateOrganizationDto) {
    const { data, error } = await createOrganizationApi({ body });
    if (error) throw new Error(errorMessage(error, 'Create organization failed.'));
    return data;
}
