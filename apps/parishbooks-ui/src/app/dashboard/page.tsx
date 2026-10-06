import { redirect } from 'next/navigation';
import { loadWorkspaceOrganizations } from '@/lib/actions/org/load-workspace-organizations';
import { dashboardPath, defaultOrgSlug } from '@/lib/dashboard/paths';

/** `/dashboard` → `/dashboard/{orgSlug}` for the active (or first) organization. */
export default async function DashboardIndexPage() {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace || workspace.organizations.length === 0) redirect('/onboarding');
    const slug = defaultOrgSlug(workspace.organizations, workspace.activeOrganizationId);
    if (!slug) redirect('/onboarding');
    redirect(dashboardPath(slug));
}
