'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { loadWorkspaceOrganizations } from './load-workspace-organizations';

/**
 * If the session active org does not match the URL tenant, bounce through the
 * activate route handler (cookie writes are not allowed during RSC render).
 */
export async function ensureActiveOrganization(organizationId: string, fallbackNext: string): Promise<void> {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace) return;
    const belongsToUrlOrg = workspace.organizations.some((org) => org.id === organizationId);
    if (!belongsToUrlOrg) return;
    if (workspace.activeOrganizationId === organizationId) return;
    // Better Auth sessions often omit activeOrganizationId; the dashboard URL is the tenant source of truth.
    if (!workspace.activeOrganizationId) return;

    const headerStore = await headers();
    const next = headerStore.get('x-pathname') || fallbackNext;
    const params = new URLSearchParams({ organizationId, next });
    redirect(`/api/org/activate?${params.toString()}`);
}
