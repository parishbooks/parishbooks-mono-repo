'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@parishbooks/design-system/utils';
import { setActiveOrg } from '@/lib/actions/org/set-active-org';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';
import { dashboardPath } from '@/lib/utils/paths';
import { EmptyOrganizations } from './empty-organizations';
import { OrganizationList } from './organization-list';

type OrganizationPickerProps = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
};

export function OrganizationPicker({ organizations, activeOrganizationId }: OrganizationPickerProps) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const hasOrganizations = organizations.length > 0;

    async function openOrganization(organization: WorkspaceOrganization) {
        if (pendingId) return;
        setError(null);
        setPendingId(organization.id);
        try {
            await setActiveOrg({ organizationId: organization.id });
            router.push(dashboardPath(organization.slug));
        } catch (cause) {
            setPendingId(null);
            setError(cause instanceof Error ? cause.message : 'Could not open this organization.');
        }
    }

    return (
        <div className={cn('mx-auto grid w-full max-w-4xl', hasOrganizations ? 'content-start' : 'min-h-[calc(100vh-8rem)] content-center')}>
            {hasOrganizations ? (
                <OrganizationList
                    organizations={organizations}
                    activeOrganizationId={activeOrganizationId}
                    pendingId={pendingId}
                    error={error}
                    onOpen={openOrganization}
                />
            ) : (
                <EmptyOrganizations />
            )}
        </div>
    );
}
