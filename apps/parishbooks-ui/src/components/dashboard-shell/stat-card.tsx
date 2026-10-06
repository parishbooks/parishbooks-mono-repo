import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, note, icon: Icon, href }: { label: string; value: string; note: string; icon: LucideIcon; href?: string }) {
    const content = (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </span>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">{note}</p>
        </>
    );

    if (!href) return <div className="rounded-2xl border bg-card p-5">{content}</div>;

    return (
        <Link href={href} className="rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/40">
            {content}
        </Link>
    );
}
