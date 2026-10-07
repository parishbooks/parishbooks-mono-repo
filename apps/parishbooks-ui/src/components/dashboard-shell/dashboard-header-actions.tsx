import { ModeToggle } from '@parishbooks/design-system/mode-toggle';
import { Bell, Search } from 'lucide-react';

export function DashboardHeaderActions() {
    return (
        <div className="ml-auto flex items-center gap-3">
            <div className="hidden h-10 w-64 items-center gap-2 rounded-xl border bg-background px-3 md:flex">
                <Search className="size-4 text-muted-foreground" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="Search anything..." />
            </div>
            <button
                className="flex size-10 items-center justify-center rounded-xl border bg-background text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
            >
                <Bell className="size-4" />
            </button>
            <ModeToggle />
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">JD</div>
        </div>
    );
}
