'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bell, BookOpen, CalendarDays, CircleDollarSign, LayoutDashboard, Menu, Megaphone, Search, Settings, Users, X } from 'lucide-react';
import { useState } from 'react';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { useOrg } from '@/lib/context/org';
import { dashboardPath } from '@/lib/utils/paths';
import { WorkspaceSwitcher } from './workspace-switcher';

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { orgSlug } = useOrg();
    const [open, setOpen] = useState(false);

    const nav = [
        ['Overview', dashboardPath(orgSlug), LayoutDashboard],
        ['Giving', dashboardPath(orgSlug, 'giving'), CircleDollarSign],
        ['Members', dashboardPath(orgSlug, 'members'), Users],
        ['Funds & Ledger', dashboardPath(orgSlug, 'funds-ledger'), BookOpen],
        ['Events', dashboardPath(orgSlug, 'events'), CalendarDays],
        ['Campaigns', dashboardPath(orgSlug, 'campaigns'), Megaphone],
        ['Reports', dashboardPath(orgSlug, 'reports'), BarChart3],
    ] as const;

    const settingsHref = dashboardPath(orgSlug, 'settings/profile');

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r bg-card p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-2 pb-8">
                    <Link href={dashboardPath(orgSlug)} className="flex items-center gap-3 font-semibold tracking-tight">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">pb</span>
                        <span className="text-lg">ParishBooks</span>
                    </Link>
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
                        className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium ${pathname.startsWith(dashboardPath(orgSlug, 'settings')) ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                    >
                        <Settings className="size-4" />
                        Settings
                    </Link>
                    <SignOutButton />
                </div>
            </aside>
            {open && <button className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-card/90 px-5 backdrop-blur md:px-8">
                    <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
                        <Menu />
                    </button>
                    <WorkspaceSwitcher />
                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden h-10 w-64 items-center gap-2 rounded-xl border bg-background px-3 md:flex">
                            <Search className="size-4 text-muted-foreground" />
                            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search anything..." />
                        </div>
                        <button
                            className="flex size-10 items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-foreground"
                            aria-label="Notifications"
                        >
                            <Bell className="size-4" />
                        </button>
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">JD</div>
                    </div>
                </header>
                <main className="min-h-[calc(100vh-5rem)] p-5 md:p-8">{children}</main>
            </div>
        </div>
    );
}
