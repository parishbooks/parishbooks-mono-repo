'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Building2, Check, Plus } from 'lucide-react';
import { setActiveOrg } from '@/lib/actions/org/set-active-org';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';

type OrganizationsCardProps = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
};

function orgInitial(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    const second = parts[1];
    if (!first) return '?';
    if (!second) return first.slice(0, 2).toUpperCase();
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

export function OrganizationsCard({ organizations, activeOrganizationId }: OrganizationsCardProps) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

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
        <div>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Organizations</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Workspaces you can switch between.</p>
                </div>
                <Link href="/onboarding" className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-accent">
                    <Plus className="size-4" />
                    Create
                </Link>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {organizations.map((org) => {
                    const isActive = org.id === activeOrganizationId;
                    const isSelecting = pendingId === org.id;
                    return (
                        <li key={org.id}>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => selectOrganization(org.id)}
                                className={`flex h-full w-full flex-col gap-4 rounded-2xl border bg-card p-4 text-left transition-colors disabled:opacity-60 ${
                                    isActive ? 'border-primary/40 bg-primary/5' : 'hover:bg-accent'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                                        }`}
                                    >
                                        {orgInitial(org.name)}
                                    </span>
                                    {isActive || isSelecting ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                            <Check className="size-3.5" />
                                            {isSelecting ? 'Switching…' : 'Active'}
                                        </span>
                                    ) : (
                                        <Building2 className="size-4 shrink-0 text-muted-foreground" />
                                    )}
                                </div>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium">{org.name}</span>
                                    {org.slug ? <span className="mt-0.5 block truncate text-xs text-muted-foreground">/{org.slug}</span> : null}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
