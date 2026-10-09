import { ModeToggle } from '@parishbooks/design-system/mode-toggle';
import { Bell } from 'lucide-react';
import { DashboardSearch } from './dashboard-search';

export function DashboardHeaderActions({ showSearch = true }: { showSearch?: boolean }) {
    return (
        <div className="ml-auto flex items-center gap-3">
            {showSearch ? <DashboardSearch className="hidden w-64 md:flex" /> : null}
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
