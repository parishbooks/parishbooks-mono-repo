'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Building2, CalendarDays, CircleDollarSign, LayoutDashboard, Menu, Megaphone, Settings, Users, X } from 'lucide-react';
import { SiteBrand } from '@parishbooks/site-ui';
import { SignOutButton } from '@/components/auth/sign-out-button';
import type { WorkspaceOrganization } from '@/lib/actions/org/load-workspace-organizations';
import { dashboardPath } from '@/lib/utils/paths';
import { DashboardHeaderActions } from './dashboard-header-actions';
import { WorkspaceSwitcher } from './workspace-switcher';

export interface DashboardOrgShellProps {
    children: React.ReactNode;
    organizations: WorkspaceOrganization[];
    orgSlug: string;
}

/** Chrome for an open organization: sidebar navigation plus the shared header. */
export function DashboardOrgShell({ children, organizations, orgSlug }: DashboardOrgShellProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const homeHref = dashboardPath(orgSlug);
    const settingsHref = dashboardPath(orgSlug, 'settings/profile');
    const settingsActive = pathname.startsWith(dashboardPath(orgSlug, 'settings'));

    const nav = [
        ['My Orgs', '/dashboard', Building2],
        ['Overview', homeHref, LayoutDashboard],
        ['Giving', dashboardPath(orgSlug, 'giving'), CircleDollarSign],
        ['Members', dashboardPath(orgSlug, 'members'), Users],
        ['Funds & Ledger', dashboardPath(orgSlug, 'funds-ledger'), BookOpen],
        ['Events', dashboardPath(orgSlug, 'events'), CalendarDays],
        ['Campaigns', dashboardPath(orgSlug, 'campaigns'), Megaphone],
        ['Reports', dashboardPath(orgSlug, 'reports'), BarChart3],
    ] as const;

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r bg-card p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-2 pb-8">
                    <SiteBrand href={homeHref} />
                    <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
                        <X />
                    </button>
                </div>
                <p className="px-3 pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>
                <nav className="flex flex-col gap-1">
                    {nav.map(([label, href, Icon]) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${pathname === href ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                        >
                            <Icon className="size-4" />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto flex flex-col gap-1 pt-8">
                    <Link
                        href={settingsHref}
                        onClick={() => setOpen(false)}
                        className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${settingsActive ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                        <Settings className="size-4" />
                        Settings
                    </Link>
                    <SignOutButton />
                </div>
            </aside>
            {open ? <button className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" /> : null}
            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-card/90 px-5 backdrop-blur md:px-8">
                    <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
                        <Menu />
                    </button>
                    <WorkspaceSwitcher organizations={organizations} />
                    <DashboardHeaderActions />
                </header>
                <main className="min-h-[calc(100vh-5rem)] p-5 md:p-8">{children}</main>
            </div>
        </div>
    );
}
