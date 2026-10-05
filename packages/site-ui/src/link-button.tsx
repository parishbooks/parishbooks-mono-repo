import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonVariants } from '@parishbooks/design-system/ui/button';
import { cn } from '@parishbooks/design-system/utils';

type Variant = 'primary' | 'secondary';

function mapVariant(variant: Variant) {
    return variant === 'primary' ? 'default' : 'outline';
}

const marketingSize = cn('min-h-11 rounded-lg px-5 text-base');

export function LinkButton({
    children,
    variant = 'primary',
    href,
    type = 'button',
    disabled,
    className,
    onClick,
}: {
    children: ReactNode;
    variant?: Variant;
    href?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}) {
    const classes = cn(buttonVariants({ variant: mapVariant(variant), size: 'lg' }), marketingSize, className);

    if (href)
        return (
            <Link href={href} className={classes} onClick={onClick}>
                {children}
            </Link>
        );

    return (
        <button type={type} disabled={disabled} className={classes} onClick={onClick}>
            {children}
        </button>
    );
}
