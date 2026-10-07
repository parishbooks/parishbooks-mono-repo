'use client';

import { CircleDollarSign, Repeat, Receipt, TrendingUp } from 'lucide-react';
import { useOrg } from '@/lib/context/org';
import { OnlineGivingSoftGate } from './online-giving-soft-gate';
import { RecordDonationButton } from './record-donation-button';
import { StatCard } from './stat-card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@parishbooks/design-system/ui/table';
import { Badge } from '@parishbooks/design-system/ui/badge';

const donations = [
    { donor: 'Maria Alvarez', fund: 'General Fund', amount: '$250.00', method: 'Card', date: 'Sep 2, 2026', status: 'Completed' as const },
    { donor: 'James Chen', fund: 'Building Fund', amount: '$1,000.00', method: 'ACH', date: 'Sep 1, 2026', status: 'Completed' as const },
    { donor: 'The Nguyen Family', fund: 'General Fund', amount: '$75.00', method: 'Cash', date: 'Aug 30, 2026', status: 'Completed' as const },
    { donor: 'Robert Kelly', fund: 'Missions Fund', amount: '$500.00', method: 'Check', date: 'Aug 28, 2026', status: 'Pending' as const },
    { donor: 'Angela Torres', fund: 'General Fund', amount: '$120.00', method: 'Card', date: 'Aug 27, 2026', status: 'Completed' as const },
];

const onlineMethods = new Set(['Card', 'ACH']);

export function GivingPageContent() {
    const { orgSlug, capabilities } = useOrg();
    const onlineEnabled = capabilities?.capabilities.canCollectOnlineDonations ?? false;

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Giving</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Donations</h1>
                    <p className="mt-2 text-muted-foreground">Track donations, recurring gifts, and donor activity.</p>
                </div>
                <RecordDonationButton orgSlug={orgSlug} capabilities={capabilities} />
            </div>
            {capabilities ? (
                <div className="mb-6">
                    <OnlineGivingSoftGate orgSlug={orgSlug} capabilities={capabilities} />
                </div>
            ) : null}
            <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${!onlineEnabled ? 'opacity-90' : ''}`}>
                <StatCard label="Total giving (MTD)" value="$4,820" note="Across all funds" icon={CircleDollarSign} />
                <StatCard label="Recurring givers" value="38" note="Active recurring gifts" icon={Repeat} />
                <StatCard label="Average gift" value="$142" note="Last 30 days" icon={Receipt} />
                <StatCard label="YTD total" value="$62,140" note="Jan 1 – present" icon={TrendingUp} />
            </div>
            <div className="mt-6 rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent donations</h2>
                    <button className="rounded-lg border px-3 py-2 text-sm">This month</button>
                </div>
                {!onlineEnabled ? (
                    <p className="mb-4 text-sm text-muted-foreground">
                        Sample data below includes online methods for preview. Card and ACH gifts will sync here after verification.
                    </p>
                ) : null}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Donor</TableHead>
                            <TableHead>Fund</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {donations.map((d) => {
                            const onlineRow = onlineMethods.has(d.method);
                            const mutedOnline = !onlineEnabled && onlineRow;
                            return (
                                <TableRow key={d.donor + d.date} className={mutedOnline ? 'opacity-50' : undefined}>
                                    <TableCell className="font-medium">{d.donor}</TableCell>
                                    <TableCell className="text-muted-foreground">{d.fund}</TableCell>
                                    <TableCell>{d.amount}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {d.method}
                                        {mutedOnline ? <span className="ml-2 text-xs text-muted-foreground">(online — after verification)</span> : null}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{d.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={d.status === 'Completed' ? 'secondary' : 'outline'}>{d.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
