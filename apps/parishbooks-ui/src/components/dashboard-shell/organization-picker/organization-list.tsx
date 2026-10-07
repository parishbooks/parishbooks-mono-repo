'use client';

import Link from 'next/link';
import { ChevronRight, Plus } from 'lucide-react';
import { buttonVariants } from '@parishbooks/design-system/ui/button';
import { Spinner } from '@parishbooks/design-system/ui/spinner';
import { cn } from '@parishbooks/design-system/utils';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';

function orgInitial(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    const second = parts[1];
    if (!first) return '?';
    if (!second) return first.slice(0, 2).toUpperCase();
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

export function OrganizationList({
    organizations,
    activeOrganizationId,
    pendingId,
    error,
    onOpen,
}: {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
    pendingId: string | null;
    error: string | null;
    onOpen: (organization: WorkspaceOrganization) => void;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Choose a parish to open its books.</p>
                </div>
                <Link href="/onboarding" className={buttonVariants({ variant: 'outline' })}>
                    <Plus data-icon="inline-start" />
                    Create organization
                </Link>
            </div>

            {error ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                    {error}
                </p>
            ) : null}

            <ul className="grid gap-3 sm:grid-cols-2">
                {organizations.map((organization) => {
                    const isCurrent = organization.id === activeOrganizationId;
                    const isPending = pendingId === organization.id;
                    return (
                        <li key={organization.id}>
                            <button
                                type="button"
                                disabled={pendingId !== null}
                                aria-busy={isPending || undefined}
                                onClick={() => onOpen(organization)}
                                className={cn(
                                    'flex h-full w-full items-center gap-4 rounded-xl border bg-card px-4 py-3 text-left transition-colors outline-none',
                                    'hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                    'disabled:pointer-events-none disabled:opacity-60',
                                    isCurrent && 'border-primary/40',
                                )}
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                                    {orgInitial(organization.name)}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">{organization.name}</span>
                                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{organization.slug}</span>
                                </span>
                                {isCurrent ? <span className="text-xs font-medium text-primary">Current</span> : null}
                                {isPending ? <Spinner /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
