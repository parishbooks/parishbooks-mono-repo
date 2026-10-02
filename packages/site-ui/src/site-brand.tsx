import Link from 'next/link';
import { Church } from 'lucide-react';
import { cn } from '@parishbooks/design-system/utils';

export function SiteBrand({ href = '/', className, showIcon = true }: { href?: string; className?: string; showIcon?: boolean }) {
    return (
        <Link href={href} className={cn('flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground', className)}>
            {showIcon ? (
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Church className="size-4" />
                </span>
            ) : null}
            ParishBooks
        </Link>
    );
}
