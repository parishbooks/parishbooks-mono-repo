import { DashboardOrgShell } from '@/components/dashboard-shell';
import { OrgProvider } from '@/lib/context/org';
import { stubCapabilities, stubWorkspace, workspaceOrganization } from '@/lib/stub/workspace';

type OrgLayoutProps = {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
};

export default async function OrgDashboardLayout({ children, params }: OrgLayoutProps) {
    const { orgSlug } = await params;
    const organization = workspaceOrganization(orgSlug);
    const organizations = stubWorkspace.organizations.some((item) => item.slug === organization.slug)
        ? stubWorkspace.organizations
        : [organization, ...stubWorkspace.organizations];

    return (
        <DashboardOrgShell organizations={organizations} orgSlug={organization.slug}>
            <OrgProvider
                initial={{ organizations, activeOrganizationId: organization.id }}
                orgSlug={organization.slug}
                capabilities={stubCapabilities(organization.id)}
            >
                {children}
            </OrgProvider>
        </DashboardOrgShell>
    );
}
