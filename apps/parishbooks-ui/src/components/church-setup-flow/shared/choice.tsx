import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function Choice({
    active,
    onClick,
    icon: Icon,
    leading,
    title,
    description,
}: {
    active: boolean;
    onClick: () => void;
    icon?: LucideIcon;
    leading?: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                active ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'hover:border-primary/40 hover:bg-muted/40'
            }`}
        >
            {leading ? (
                <span className="flex size-11 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/15">{leading}</span>
            ) : (
                <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                    {Icon ? <Icon className="size-5" /> : null}
                </span>
            )}
            <span className="min-w-0">
                <span className="block font-medium">{title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
            </span>
        </button>
    );
}
