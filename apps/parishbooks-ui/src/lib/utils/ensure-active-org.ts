import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { loadWorkspaceOrganizations } from '@/lib/utils/load-workspace-organizations';

/**
 * If the session active org does not match the URL tenant, bounce through the
 * activate route handler (cookie writes are not allowed during RSC render).
 */
export async function ensureActiveOrganization(organizationId: string, fallbackNext: string): Promise<void> {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace) return;
    if (workspace.activeOrganizationId === organizationId) return;

    const headerStore = await headers();
    const next = headerStore.get('x-pathname') || fallbackNext;
    const params = new URLSearchParams({ organizationId, next });
    redirect(`/api/org/activate?${params.toString()}`);
}
