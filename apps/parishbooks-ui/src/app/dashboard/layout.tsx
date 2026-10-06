import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard-shell';
import { loadWorkspaceOrganizations } from '@/lib/actions/org/load-workspace-organizations';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace || workspace.organizations.length === 0) redirect('/onboarding');

    return (
        <DashboardShell organizations={workspace.organizations} activeOrganizationId={workspace.activeOrganizationId}>
            {children}
        </DashboardShell>
    );
}
