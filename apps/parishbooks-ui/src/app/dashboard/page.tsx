import { redirect } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard-shell';
import { loadWorkspaceOrganizations } from '@/lib/actions/org/load-workspace-organizations';

export default async function DashboardPage() {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace || workspace.organizations.length === 0) redirect('/onboarding');

    return <DashboardOverview organizations={workspace.organizations} activeOrganizationId={workspace.activeOrganizationId} />;
}
