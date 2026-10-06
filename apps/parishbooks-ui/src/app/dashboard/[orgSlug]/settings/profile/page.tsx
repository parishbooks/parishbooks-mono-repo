import { redirect } from 'next/navigation';
import { OrganizationProfileForm } from './organization-profile-form';
import { loadOrganizationProfile } from './load-organization-profile';

type ProfilePageProps = {
    params: Promise<{ orgSlug: string }>;
};

export default async function Page({ params }: ProfilePageProps) {
    const { orgSlug } = await params;
    const profile = await loadOrganizationProfile(orgSlug);
    if (!profile) redirect('/onboarding');

    return (
        <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-primary">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Organization profile</h1>
            <p className="mt-2 text-muted-foreground">Manage the details your team sees across ParishBooks.</p>
            <OrganizationProfileForm key={profile.organizationId} defaultValues={profile.defaults} updatedAt={profile.updatedAt} />
        </div>
    );
}
