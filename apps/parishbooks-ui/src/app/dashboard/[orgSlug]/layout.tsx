import { notFound, redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard-shell';
import { ensureActiveOrganization } from '@/lib/utils/ensure-active-org';
import { loadWorkspaceOrganizations } from '@/lib/utils/load-workspace-organizations';
import { OrgProvider } from '@/lib/context/org';
import { dashboardPath, defaultOrgSlug } from '@/lib/dashboard/paths';

type OrgLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
};

export default async function OrgDashboardLayout({ children, params }: OrgLayoutProps) {
    const { orgSlug } = await params;
    const workspace = await loadWorkspaceOrganizations();
    if (!workspace || workspace.organizations.length === 0) redirect('/onboarding');

    const organization = workspace.organizations.find((org) => org.slug === orgSlug);
    if (!organization) {
        const fallback = defaultOrgSlug(workspace.organizations, workspace.activeOrganizationId);
        if (!fallback) notFound();
        redirect(dashboardPath(fallback));
    }

    await ensureActiveOrganization(organization.id, dashboardPath(organization.slug));

    return (
        <OrgProvider initial={workspace} orgSlug={organization.slug}>
            <DashboardShell>{children}</DashboardShell>
        </OrgProvider>
    );
}
