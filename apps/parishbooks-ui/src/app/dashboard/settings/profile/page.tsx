import { redirect } from 'next/navigation';
import { OrganizationProfileForm } from './organization-profile-form';
import { loadOrganizationProfile } from './load-organization-profile';

export default async function Page() {
    const profile = await loadOrganizationProfile();
    if (!profile) redirect('/onboarding');

    return (
        <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-primary">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Organization profile</h1>
            <p className="mt-2 text-muted-foreground">Manage the details your team sees across ParishBooks.</p>
            <OrganizationProfileForm defaultValues={profile.defaults} updatedAt={profile.updatedAt} />
        </div>
    );
}
