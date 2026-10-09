import { DashboardShell, OrganizationPicker } from '@/components/dashboard-shell';
import { stubWorkspace } from '@/lib/stub/workspace';

export default function DashboardIndexPage() {
    return (
        <DashboardShell>
            <OrganizationPicker organizations={stubWorkspace.organizations} activeOrganizationId={stubWorkspace.activeOrganizationId} />
        </DashboardShell>
    );
}
