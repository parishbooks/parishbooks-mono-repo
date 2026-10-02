'use client';

import { BarChart3, CalendarDays, CircleDollarSign, FileText, Megaphone, Users } from 'lucide-react';
import { StatCard } from './stat-card';

export function DashboardOverview() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Tuesday, September 4, 2026</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Good morning, James.</h1>
                    <p className="mt-2 text-muted-foreground">Here&apos;s what&apos;s happening with your parish today.</p>
                </div>
                <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm">Record donation</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total giving" value="$0" note="No donations recorded yet" icon={CircleDollarSign} />
                <StatCard label="Active members" value="0" note="Build your community" icon={Users} />
                <StatCard label="Upcoming events" value="0" note="Plan your next gathering" icon={CalendarDays} />
                <StatCard label="Open campaigns" value="0" note="Create your first campaign" icon={Megaphone} />
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
                <div className="rounded-2xl border bg-card p-6">
                    <h2 className="text-lg font-semibold">Get started</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Set up ParishBooks for your team.</p>
                    <div className="mt-6 flex flex-col gap-4">
                        {['Invite your team', 'Add your first fund', 'Record your first donation'].map((item, i) => (
                            <div key={item} className="flex items-center gap-3 rounded-xl border p-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">{i + 1}</span>
                                <span className="text-sm font-medium">{item}</span>
                                <FileText className="ml-auto size-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
