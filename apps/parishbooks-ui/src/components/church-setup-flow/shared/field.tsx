import type { ReactNode } from 'react';
import { Label } from '@parishbooks/design-system/ui/label';

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
        </div>
    );
}
