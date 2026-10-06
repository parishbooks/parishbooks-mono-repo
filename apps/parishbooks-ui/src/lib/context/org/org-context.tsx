'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setActiveOrg } from '@/lib/actions/org/set-active-org';
import type { WorkspaceOrganization, WorkspaceOrganizations } from '@/lib/actions/org/load-workspace-organizations';
import { replaceDashboardOrgSlug } from '@/lib/dashboard/paths';

type OrgContextValue = {
    organizations: WorkspaceOrganization[];
    orgSlug: string;
    activeOrganizationId: string | null;
    activeOrganization: WorkspaceOrganization | null;
    switchOrg: (organizationId: string) => Promise<void>;
};

const OrgContext = createContext<OrgContextValue | null>(null);

type OrgProviderProps = {
    initial: WorkspaceOrganizations;
    orgSlug: string;
    children: ReactNode;
};

export function OrgProvider({ initial, orgSlug, children }: OrgProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [organizations, setOrganizations] = useState(initial.organizations);
    const activeOrganization = organizations.find((org) => org.slug === orgSlug) ?? null;
    const activeOrganizationId = activeOrganization?.id ?? null;

    async function switchOrg(organizationId: string) {
        if (organizationId === activeOrganizationId) return;
        const organization = organizations.find((org) => org.id === organizationId);
        if (!organization) return;
        await setActiveOrg({ organizationId });
        router.push(replaceDashboardOrgSlug(pathname, organization.slug));
    }

    useEffect(() => {
        setOrganizations(initial.organizations);
    }, [initial.organizations]);

    return <OrgContext.Provider value={{ organizations, orgSlug, activeOrganizationId, activeOrganization, switchOrg }}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextValue {
    const value = useContext(OrgContext);
    if (!value) throw new Error('useOrg must be used within OrgProvider');
    return value;
}
