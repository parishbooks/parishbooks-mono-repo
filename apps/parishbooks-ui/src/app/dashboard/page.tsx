import { getSession } from '@/lib/actions/auth/get-session';
import { loadWorkspaceOrganizations } from '@/lib/actions/org';
import { OrganizationPicker } from '@/components/dashboard-shell';

/** Post-sign-in home: pick an organization, or create the first one. */
export default async function DashboardIndexPage() {
    const [session, workspace] = await Promise.all([getSession(), loadWorkspaceOrganizations()]);
    if (!workspace) throw new Error('Could not load organizations');

    return (
        <OrganizationPicker
            organizations={workspace.organizations}
            activeOrganizationId={workspace.activeOrganizationId}
            account={{ name: session.user.name, email: session.user.email }}
        />
    );
}
