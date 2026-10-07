import { notFound, redirect } from 'next/navigation';
import { DashboardOrgShell } from '@/components/dashboard-shell';
import { ensureActiveOrganization, loadOrganizationCapabilities, loadWorkspaceOrganizations } from '@/lib/actions/org';
import { OrgProvider } from '@/lib/context/org';
import { dashboardPath, defaultOrgSlug } from '@/lib/utils/paths';

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

    const [, capabilities] = await Promise.all([
        ensureActiveOrganization(organization.id, dashboardPath(organization.slug)),
        loadOrganizationCapabilities(organization.id),
    ]);

    return (
        <DashboardOrgShell organizations={workspace.organizations} orgSlug={organization.slug}>
            <OrgProvider initial={workspace} orgSlug={organization.slug} capabilities={capabilities}>
                {children}
            </OrgProvider>
        </DashboardOrgShell>
    );
}
