'use client';

import { Wallet, Layers, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { StatCard } from '@/components/dashboard-shell';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@parishbooks/design-system/ui/table';

const funds = [
    { name: 'General Fund', balance: '$48,210.00', lastActivity: 'Sep 2, 2026' },
    {
        name: 'Building Fund',
        balance: '$112,500.00',
        lastActivity: 'Sep 1, 2026',
    },
    { name: 'Missions Fund', balance: '$9,340.00', lastActivity: 'Aug 28, 2026' },
    {
        name: 'Youth Ministry Fund',
        balance: '$3,120.00',
        lastActivity: 'Aug 24, 2026',
    },
];

const entries = [
    {
        date: 'Sep 2, 2026',
        description: 'Sunday collection',
        fund: 'General Fund',
        debit: '',
        credit: '$1,840.00',
        balance: '$48,210.00',
    },
    {
        date: 'Sep 1, 2026',
        description: 'ACH donation — J. Chen',
        fund: 'Building Fund',
        debit: '',
        credit: '$1,000.00',
        balance: '$112,500.00',
    },
    {
        date: 'Aug 30, 2026',
        description: 'Diocesan assessment',
        fund: 'General Fund',
        debit: '$2,500.00',
        credit: '',
        balance: '$46,370.00',
    },
    {
        date: 'Aug 28, 2026',
        description: 'Mission trip supplies',
        fund: 'Missions Fund',
        debit: '$460.00',
        credit: '',
        balance: '$9,340.00',
    },
    {
        date: 'Aug 24, 2026',
        description: 'Youth retreat deposit',
        fund: 'Youth Ministry Fund',
        debit: '$300.00',
        credit: '',
        balance: '$3,120.00',
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <p className="text-sm font-medium text-primary">Funds &amp; Ledger</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Finances</h1>
                <p className="mt-2 text-muted-foreground">Bring your parish finances into a simple, transparent ledger.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total balance" value="$173,170" note="Across all funds" icon={Wallet} />
                <StatCard label="Active funds" value="4" note="General, building, missions, youth" icon={Layers} />
                <StatCard label="In this month" value="$2,840" note="Deposits recorded" icon={ArrowDownToLine} />
                <StatCard label="Out this month" value="$3,260" note="Expenses recorded" icon={ArrowUpFromLine} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {funds.map((f) => (
                    <div key={f.name} className="rounded-2xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">{f.name}</p>
                        <p className="mt-3 text-2xl font-semibold tracking-tight">{f.balance}</p>
                        <p className="mt-5 text-xs text-muted-foreground">Last activity {f.lastActivity}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Ledger entries</h2>
                    <button className="rounded-lg border px-3 py-2 text-sm">This month</button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Fund</TableHead>
                            <TableHead>Debit</TableHead>
                            <TableHead>Credit</TableHead>
                            <TableHead>Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((e) => (
                            <TableRow key={e.date + e.description}>
                                <TableCell className="text-muted-foreground">{e.date}</TableCell>
                                <TableCell className="font-medium">{e.description}</TableCell>
                                <TableCell className="text-muted-foreground">{e.fund}</TableCell>
                                <TableCell className="text-muted-foreground">{e.debit}</TableCell>
                                <TableCell className="text-muted-foreground">{e.credit}</TableCell>
                                <TableCell>{e.balance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
