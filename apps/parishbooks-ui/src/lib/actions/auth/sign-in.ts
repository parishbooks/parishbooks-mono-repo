'use server';

import { signInApi, type SignInDto, type SignInResponseDto } from '@/lib/api-client';
import { applyUpstreamCookies } from '@/lib/cookies/apply-upstream-cookies';
import { loadWorkspaceOrganizations } from '@/lib/actions/org/load-workspace-organizations';
import { errorMessage } from '@/lib/utils/error-message';

export async function signIn(body: SignInDto): Promise<SignInResponseDto & { orgSlug?: string }> {
    const { data, error, response } = await signInApi({ body });
    if (error || !data) throw new Error(errorMessage(error, 'Sign in failed.'));
    if (response) await applyUpstreamCookies(response);
    if (data.redirectTo !== 'dashboard') return data;

    const workspace = await loadWorkspaceOrganizations();
    if (!workspace?.activeOrganizationId) return data;
    const active = workspace.organizations.find((org) => org.id === workspace.activeOrganizationId);
    if (!active) return data;
    return { ...data, orgSlug: active.slug };
}
