import { DashboardShell, OrganizationPicker } from '@/components/dashboard-shell';
import { loadWorkspaceOrganizations } from '@/lib/actions/org';

export default async function DashboardIndexPage() {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace) throw new Error('Could not load organizations');

    return (
        <DashboardShell>
            <OrganizationPicker organizations={workspace.organizations} activeOrganizationId={workspace.activeOrganizationId} />
        </DashboardShell>
    );
}
