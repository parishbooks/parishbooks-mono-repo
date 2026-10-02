import { FileText, CircleDollarSign, Wallet, Users, FileCheck2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@parishbooks/design-system/ui/table';

const reportTypes = [
    {
        name: 'Giving summary',
        description: 'Donations by fund, donor, and date range.',
        icon: CircleDollarSign,
    },
    {
        name: 'Fund balances',
        description: 'Current balances and activity across all funds.',
        icon: Wallet,
    },
    {
        name: 'Member statement',
        description: 'Individual giving history for tax purposes.',
        icon: Users,
    },
    {
        name: 'Tax-year giving statements',
        description: 'Bulk annual statements for all donors.',
        icon: FileCheck2,
    },
];

const recentReports = [
    {
        name: 'August giving summary',
        type: 'Giving summary',
        generated: 'Sep 1, 2026',
    },
    {
        name: 'Fund balances — Q3',
        type: 'Fund balances',
        generated: 'Aug 15, 2026',
    },
    {
        name: '2025 tax-year statements',
        type: 'Tax-year giving statements',
        generated: 'Jan 20, 2026',
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Reports</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Insights</h1>
                    <p className="mt-2 text-muted-foreground">Get a clear view of your parish health with reports built for action.</p>
                </div>
                <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Generate report</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {reportTypes.map((r) => (
                    <div key={r.name} className="rounded-2xl border bg-card p-5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <r.icon className="size-5" />
                        </div>
                        <h3 className="mt-4 font-semibold">{r.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recently generated</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Generated</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentReports.map((r) => (
                            <TableRow key={r.name}>
                                <TableCell className="font-medium">{r.name}</TableCell>
                                <TableCell className="text-muted-foreground">{r.type}</TableCell>
                                <TableCell className="text-muted-foreground">{r.generated}</TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                                        <FileText className="size-4" />
                                        View
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
