import { getSession } from '@/lib/actions/auth/get-session';
import { getOrganization } from '@/lib/actions/org/get-org';
import { dashboardPath } from '@/lib/utils/paths';
import { redirect } from 'next/navigation';

/** `/dashboard` → `/dashboard/{orgSlug}` for the active (or first) organization. */
export default async function DashboardIndexPage() {
    const session = await getSession();
    if (!session.session.activeOrganizationId) redirect('/onboarding');
    const org = await getOrganization(session.session.activeOrganizationId);
    redirect(dashboardPath(org.slug));
}
