import { redirect } from 'next/navigation';
import { dashboardPath } from '@/lib/utils/paths';

type SettingsIndexProps = {
    params: Promise<{ orgSlug: string }>;
};

export default async function SettingsIndexPage({ params }: SettingsIndexProps) {
    const { orgSlug } = await params;
    redirect(dashboardPath(orgSlug, 'settings/profile'));
}
