import { DashboardShell, OrganizationPicker } from '@/components/dashboard-shell';
import { loadWorkspaceOrganizations } from '@/lib/actions/org';

/** Post-sign-in home: pick an organization, or create the first one. */
export default async function DashboardIndexPage() {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace) throw new Error('Could not load organizations');

    return (
        <DashboardShell>
            <OrganizationPicker organizations={workspace.organizations} activeOrganizationId={workspace.activeOrganizationId} />
        </DashboardShell>
    );
}
