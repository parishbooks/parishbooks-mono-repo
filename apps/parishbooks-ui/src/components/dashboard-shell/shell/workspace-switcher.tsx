'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Check, ChevronDown, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@parishbooks/design-system/ui/dropdown-menu';
import type { WorkspaceOrganization } from '@/lib/stub/workspace';
import { orgSlugFromPathname, replaceDashboardOrgSlug } from '@/lib/utils/paths';

export function WorkspaceSwitcher({ organizations }: { organizations: WorkspaceOrganization[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const orgSlug = orgSlugFromPathname(pathname);
    const activeOrganization = orgSlug ? (organizations.find((org) => org.slug === orgSlug) ?? null) : null;
    const label = activeOrganization?.name ?? 'Select organization';

    function switchOrg(organizationId: string) {
        if (organizationId === activeOrganization?.id) return;
        const organization = organizations.find((org) => org.id === organizationId);
        if (!organization) return;
        router.push(replaceDashboardOrgSlug(pathname, organization.slug));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                <span className="hidden text-muted-foreground sm:inline">Workspace /</span>
                <span>{label}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    {organizations.map((org) => {
                        const isActive = org.id === activeOrganization?.id;
                        return (
                            <DropdownMenuItem key={org.id} onClick={() => switchOrg(org.id)}>
                                <span className="flex-1 truncate">{org.name}</span>
                                {isActive && <Check className="size-4 text-primary" />}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/onboarding" />}>
                    <Plus className="size-4" />
                    Create organization
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
