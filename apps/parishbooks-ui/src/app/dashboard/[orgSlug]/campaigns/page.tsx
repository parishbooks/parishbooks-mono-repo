'use client';

import { Megaphone, TrendingUp, Target } from 'lucide-react';
import { StatCard } from '@/components/dashboard-shell';

const campaigns = [
    {
        name: 'Roof Restoration Fund',
        goal: 150000,
        raised: 98400,
        endDate: 'Dec 31, 2026',
    },
    {
        name: 'Christmas Giving Drive',
        goal: 20000,
        raised: 14750,
        endDate: 'Dec 24, 2026',
    },
    {
        name: 'New Parish Van',
        goal: 45000,
        raised: 12300,
        endDate: 'Nov 15, 2026',
    },
    {
        name: 'Youth Mission Trip',
        goal: 18000,
        raised: 16920,
        endDate: 'Oct 1, 2026',
    },
];

function currency(n: number) {
    return `$${n.toLocaleString('en-US')}`;
}

export default function Page() {
    const avgProgress = Math.round((campaigns.reduce((sum, c) => sum + c.raised / c.goal, 0) / campaigns.length) * 100);
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Campaigns</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Fundraising</h1>
                    <p className="mt-2 text-muted-foreground">Launch meaningful campaigns and understand their impact.</p>
                </div>
                <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">New campaign</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Active campaigns" value={String(campaigns.length)} note="Currently running" icon={Megaphone} />
                <StatCard label="Total raised" value={currency(campaigns.reduce((s, c) => s + c.raised, 0))} note="Across active campaigns" icon={TrendingUp} />
                <StatCard label="Average goal progress" value={`${avgProgress}%`} note="Across active campaigns" icon={Target} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {campaigns.map((c) => {
                    const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
                    return (
                        <div key={c.name} className="rounded-2xl border bg-card p-5">
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold">{c.name}</h3>
                                <span className="text-sm font-medium text-primary">{pct}%</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {currency(c.raised)} raised of {currency(c.goal)} goal
                            </p>
                            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground">Ends {c.endDate}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
