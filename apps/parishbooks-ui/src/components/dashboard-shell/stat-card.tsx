import type { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
    return (
        <div className="rounded-2xl border bg-card p-5">
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
        </div>
    );
}
