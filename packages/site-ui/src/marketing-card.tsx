import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@parishbooks/design-system/utils';

type MarketingCardProps<T extends ElementType = 'div'> = {
    children: ReactNode;
    className?: string;
    as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'className' | 'children'>;

export function MarketingCard<T extends ElementType = 'div'>({ children, className, as, ...rest }: MarketingCardProps<T>) {
    const Tag = as ?? 'div';
    return (
        <Tag className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)} {...rest}>
            {children}
        </Tag>
    );
}
