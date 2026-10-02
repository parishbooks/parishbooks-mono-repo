import { OrganizationProfileForm } from './organization-profile-form';

export default function Page() {
    return (
        <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-primary">Settings</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Organization profile</h1>
            <p className="mt-2 text-muted-foreground">Manage the details your team sees across ParishBooks.</p>
            <OrganizationProfileForm />
        </div>
    );
}
