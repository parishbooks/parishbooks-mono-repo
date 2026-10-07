import { Search } from 'lucide-react';
import { cn } from '@parishbooks/design-system/utils';

export function DashboardSearch({
    className,
    placeholder = 'Search anything...',
    value,
    onChange,
}: {
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}) {
    return (
        <div className={cn('flex h-10 items-center gap-2 rounded-xl border bg-background px-3', className)}>
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder={placeholder}
                aria-label={placeholder}
                value={value}
                onChange={onChange ? (event) => onChange(event.target.value) : undefined}
            />
        </div>
    );
}
