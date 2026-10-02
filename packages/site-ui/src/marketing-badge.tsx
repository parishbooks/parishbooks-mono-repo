import type { ReactNode } from 'react';
import { Badge } from '@parishbooks/design-system/ui/badge';
import { cn } from '@parishbooks/design-system/utils';

export function MarketingBadge({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <Badge variant="secondary" className={cn('rounded-full px-3 py-1 text-sm font-medium', className)}>
            {children}
        </Badge>
    );
}
