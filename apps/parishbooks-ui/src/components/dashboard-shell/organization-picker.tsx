'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus } from 'lucide-react';
import { ModeToggle } from '@parishbooks/design-system/mode-toggle';
import { buttonVariants } from '@parishbooks/design-system/ui/button';
import { Spinner } from '@parishbooks/design-system/ui/spinner';
import { cn } from '@parishbooks/design-system/utils';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { setActiveOrg } from '@/lib/actions/org/set-active-org';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';
import { dashboardPath } from '@/lib/utils/paths';

type Account = {
    name: string;
    email: string;
};

type OrganizationPickerProps = {
    organizations: WorkspaceOrganization[];
    activeOrganizationId: string | null;
    account: Account;
};

function orgInitial(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0];
    const second = parts[1];
    if (!first) return '?';
    if (!second) return first.slice(0, 2).toUpperCase();
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}

function accountInitial(account: Account): string {
    return orgInitial(account.name || account.email);
}

export function OrganizationPicker({ organizations, activeOrganizationId, account }: OrganizationPickerProps) {
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
        <div className="flex min-h-screen flex-col bg-muted/30 text-foreground">
            <header className="flex h-16 items-center gap-4 border-b bg-card px-5 md:px-8">
                <Link href="/dashboard" className="flex items-center gap-3 font-semibold tracking-tight">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">pb</span>
                    <span>ParishBooks</span>
                </Link>
                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium">{account.name || account.email}</p>
                        {account.name ? <p className="text-xs text-muted-foreground">{account.email}</p> : null}
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {accountInitial(account)}
                    </span>
                    <ModeToggle />
                    <SignOutButton variant="header" />
                </div>
            </header>

            <main className={cn('mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-12 md:px-8', hasOrganizations ? 'justify-start' : 'justify-center')}>
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
            </main>
        </div>
    );
}

function OrganizationList({
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

            <ul className="flex flex-col gap-2">
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
                                    'flex w-full items-center gap-4 rounded-xl border bg-card px-4 py-3 text-left transition-colors outline-none',
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

function EmptyOrganizations() {
    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Create your first organization</h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Each parish keeps its own books. Start with the one you manage.</p>
            <Link href="/onboarding" className={buttonVariants()}>
                <Plus data-icon="inline-start" />
                Create organization
            </Link>
        </div>
    );
}
