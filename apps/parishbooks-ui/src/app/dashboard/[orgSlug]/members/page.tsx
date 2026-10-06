'use client';

import { Users, Home, UserPlus, HandHeart, Search } from 'lucide-react';
import { StatCard } from '@/components/dashboard-shell';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@parishbooks/design-system/ui/table';
import { Badge } from '@parishbooks/design-system/ui/badge';

const members = [
    {
        name: 'Maria Alvarez',
        household: 'Alvarez Household',
        email: 'maria.alvarez@example.com',
        phone: '(555) 214-8890',
        status: 'Active',
        joined: 'Mar 2021',
    },
    {
        name: 'James Chen',
        household: 'Chen Household',
        email: 'james.chen@example.com',
        phone: '(555) 330-1145',
        status: 'Active',
        joined: 'Jan 2019',
    },
    {
        name: 'Linh Nguyen',
        household: 'Nguyen Household',
        email: 'linh.nguyen@example.com',
        phone: '(555) 902-6631',
        status: 'Active',
        joined: 'Jun 2023',
    },
    {
        name: 'Robert Kelly',
        household: 'Kelly Household',
        email: 'robert.kelly@example.com',
        phone: '(555) 447-2290',
        status: 'Inactive',
        joined: 'Sep 2015',
    },
    {
        name: 'Angela Torres',
        household: 'Torres Household',
        email: 'angela.torres@example.com',
        phone: '(555) 668-3312',
        status: 'Active',
        joined: 'Nov 2022',
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Members</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Directory</h1>
                    <p className="mt-2 text-muted-foreground">Keep your parish directory organized and connected.</p>
                </div>
                <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Add member</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total members" value="312" note="Across all households" icon={Users} />
                <StatCard label="Active households" value="146" note="With at least one member" icon={Home} />
                <StatCard label="New this month" value="7" note="Joined in September" icon={UserPlus} />
                <StatCard label="Volunteers" value="24" note="Serving in ministries" icon={HandHeart} />
            </div>
            <div className="mt-6 rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold">All members</h2>
                    <div className="hidden h-10 w-64 items-center gap-2 rounded-xl border bg-background px-3 md:flex">
                        <Search className="size-4 text-muted-foreground" />
                        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search members..." />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Household</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((m) => (
                            <TableRow key={m.email}>
                                <TableCell className="font-medium">{m.name}</TableCell>
                                <TableCell className="text-muted-foreground">{m.household}</TableCell>
                                <TableCell className="text-muted-foreground">{m.email}</TableCell>
                                <TableCell className="text-muted-foreground">{m.phone}</TableCell>
                                <TableCell>
                                    <Badge variant={m.status === 'Active' ? 'secondary' : 'outline'}>{m.status}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{m.joined}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
