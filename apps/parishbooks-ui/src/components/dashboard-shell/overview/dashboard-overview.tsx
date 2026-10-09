'use client';

import { BarChart3, CalendarDays, CircleDollarSign, Megaphone, Users } from 'lucide-react';
import { useOrg } from '@/lib/context/org';
import { dashboardPath } from '@/lib/utils/paths';
import { OnlineGivingSoftGate } from '../giving/online-giving-soft-gate';
import { RecordDonationButton } from '../giving/record-donation-button';
import { StatCard } from '../shared/stat-card';
import { SetupChecklist } from './setup-checklist';

export function DashboardOverview() {
    const { orgSlug, capabilities } = useOrg();
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Tuesday, September 4, 2026</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Good morning, James.</h1>
                    <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your parish today.</p>
                </div>
                <RecordDonationButton orgSlug={orgSlug} capabilities={capabilities} />
            </div>
            {capabilities && !capabilities.capabilities.canCollectOnlineDonations ? (
                <div className="mb-6">
                    <OnlineGivingSoftGate orgSlug={orgSlug} capabilities={capabilities} />
                </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total giving" value="$0" note="No donations recorded yet" icon={CircleDollarSign} href={dashboardPath(orgSlug, 'giving')} />
                <StatCard label="Active members" value="0" note="Build your community" icon={Users} href={dashboardPath(orgSlug, 'members')} />
                <StatCard label="Upcoming events" value="0" note="Plan your next gathering" icon={CalendarDays} href={dashboardPath(orgSlug, 'events')} />
                <StatCard label="Open campaigns" value="0" note="Create your first campaign" icon={Megaphone} href={dashboardPath(orgSlug, 'campaigns')} />
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Giving overview</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Your donation activity will appear here.</p>
                        </div>
                        <button className="rounded-lg border px-3 py-2 text-sm">This month</button>
                    </div>
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <BarChart3 />
                            </div>
                            <p className="font-medium">No giving data yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">Record your first donation to see trends.</p>
                        </div>
                    </div>
                </div>
                {capabilities ? <SetupChecklist orgSlug={orgSlug} capabilities={capabilities} /> : null}
            </div>
        </div>
    );
}
