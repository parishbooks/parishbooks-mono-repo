import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@parishbooks/design-system/utils';

export function Container({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
    return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} style={style}>{children}</div>;
}
