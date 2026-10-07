'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { OrganizationCapabilities } from '@/lib/types/organization-capabilities';
import type { WorkspaceOrganization, WorkspaceOrganizations } from '@/lib/stub/workspace';
import { replaceDashboardOrgSlug } from '@/lib/utils/paths';

type OrgContextValue = {
    organizations: WorkspaceOrganization[];
    orgSlug: string;
    activeOrganizationId: string | null;
    activeOrganization: WorkspaceOrganization | null;
    capabilities: OrganizationCapabilities | null;
    switchOrg: (organizationId: string) => void;
};

const OrgContext = createContext<OrgContextValue | null>(null);

type OrgProviderProps = {
    initial: WorkspaceOrganizations;
    orgSlug: string;
    capabilities: OrganizationCapabilities | null;
    children: ReactNode;
};

export function OrgProvider({ initial, orgSlug, capabilities, children }: OrgProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [organizations, setOrganizations] = useState(initial.organizations);
    const activeOrganization = organizations.find((org) => org.slug === orgSlug) ?? null;
    const activeOrganizationId = activeOrganization?.id ?? null;

    function switchOrg(organizationId: string) {
        if (organizationId === activeOrganizationId) return;
        const organization = organizations.find((org) => org.id === organizationId);
        if (!organization) return;
        router.push(replaceDashboardOrgSlug(pathname, organization.slug));
    }

    useEffect(() => {
        setOrganizations(initial.organizations);
    }, [initial.organizations]);

    return (
        <OrgContext.Provider value={{ organizations, orgSlug, activeOrganizationId, activeOrganization, capabilities, switchOrg }}>
            {children}
        </OrgContext.Provider>
    );
}

export function useOrg(): OrgContextValue {
    const value = useContext(OrgContext);
    if (!value) throw new Error('useOrg must be used within OrgProvider');
    return value;
}
