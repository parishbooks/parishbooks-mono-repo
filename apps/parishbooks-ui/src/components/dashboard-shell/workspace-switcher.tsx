'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import Link from 'next/link';
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
import { setActiveOrg } from '@/lib/actions/org/set-active-org';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';

type WorkspaceSwitcherProps = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
};

export function WorkspaceSwitcher({ organizations, activeOrganizationId }: WorkspaceSwitcherProps) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const active = organizations.find((org) => org.id === activeOrganizationId) ?? organizations[0];
    const label = active?.name ?? 'Select organization';

    function selectOrganization(organizationId: string) {
        if (organizationId === activeOrganizationId || isPending) return;
        setPendingId(organizationId);
        startTransition(async () => {
            try {
                await setActiveOrg({ organizationId });
                router.refresh();
            } finally {
                setPendingId(null);
            }
        });
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
                        const isActive = org.id === (activeOrganizationId ?? active?.id);
                        const isSelecting = pendingId === org.id;
                        return (
                            <DropdownMenuItem key={org.id} disabled={isPending} onClick={() => selectOrganization(org.id)}>
                                <span className="flex-1 truncate">{org.name}</span>
                                {(isActive || isSelecting) && <Check className="size-4 text-primary" />}
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
