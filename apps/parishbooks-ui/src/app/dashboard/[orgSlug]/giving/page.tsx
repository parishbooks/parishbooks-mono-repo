'use client';

import { CircleDollarSign, Repeat, Receipt, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard-shell';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@parishbooks/design-system/ui/table';
import { Badge } from '@parishbooks/design-system/ui/badge';

const donations = [
    {
        donor: 'Maria Alvarez',
        fund: 'General Fund',
        amount: '$250.00',
        method: 'Card',
        date: 'Sep 2, 2026',
        status: 'Completed',
    },
    {
        donor: 'James Chen',
        fund: 'Building Fund',
        amount: '$1,000.00',
        method: 'ACH',
        date: 'Sep 1, 2026',
        status: 'Completed',
    },
    {
        donor: 'The Nguyen Family',
        fund: 'General Fund',
        amount: '$75.00',
        method: 'Cash',
        date: 'Aug 30, 2026',
        status: 'Completed',
    },
    {
        donor: 'Robert Kelly',
        fund: 'Missions Fund',
        amount: '$500.00',
        method: 'Check',
        date: 'Aug 28, 2026',
        status: 'Pending',
    },
    {
        donor: 'Angela Torres',
        fund: 'General Fund',
        amount: '$120.00',
        method: 'Card',
        date: 'Aug 27, 2026',
        status: 'Completed',
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Giving</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Donations</h1>
                    <p className="mt-2 text-muted-foreground">Track donations, recurring gifts, and donor activity.</p>
                </div>
                <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Record donation</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                        {donations.map((d) => (
                            <TableRow key={d.donor + d.date}>
                                <TableCell className="font-medium">{d.donor}</TableCell>
                                <TableCell className="text-muted-foreground">{d.fund}</TableCell>
                                <TableCell>{d.amount}</TableCell>
                                <TableCell className="text-muted-foreground">{d.method}</TableCell>
                                <TableCell className="text-muted-foreground">{d.date}</TableCell>
                                <TableCell>
                                    <Badge variant={d.status === 'Completed' ? 'secondary' : 'outline'}>{d.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
