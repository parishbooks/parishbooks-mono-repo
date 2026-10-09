'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@parishbooks/design-system/utils';
import type { WorkspaceOrganization } from '@/lib/stub/workspace';
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
    const hasOrganizations = organizations.length > 0;

    function openOrganization(organization: WorkspaceOrganization) {
        if (pendingId) return;
        setPendingId(organization.id);
        router.push(dashboardPath(organization.slug));
    }

    return (
        <div className={cn('mx-auto grid w-full max-w-4xl', hasOrganizations ? 'content-start' : 'min-h-[calc(100vh-8rem)] content-center')}>
            {hasOrganizations ? (
                <OrganizationList
                    organizations={organizations}
                    activeOrganizationId={activeOrganizationId}
                    pendingId={pendingId}
                    error={null}
                    onOpen={openOrganization}
                />
            ) : (
                <EmptyOrganizations />
            )}
        </div>
    );
}
