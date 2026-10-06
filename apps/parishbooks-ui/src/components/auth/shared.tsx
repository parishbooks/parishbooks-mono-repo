'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@parishbooks/design-system/ui/button';
import { cn } from '@parishbooks/design-system/utils';

export function FormStatus({ children, className }: { children?: ReactNode; className?: string }) {
    if (!children) return null;
    return (
        <p className={cn('rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground', className)} role="status">
            {children}
        </p>
    );
}

export function FormError({ children, className }: { children?: ReactNode; className?: string }) {
    if (!children) return null;
    return (
        <p className={cn('rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive', className)} role="alert">
            {children}
        </p>
    );
}

export function Testimonial() {
    return (
        <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5">
            <div className="mb-4 flex gap-1 text-primary-foreground/80">★★★★★</div>
            <p className="text-sm leading-6 text-primary-foreground/85">
                &ldquo;ParishBooks took our bookkeeping out of spreadsheets. Closing the month now takes an afternoon instead of a week.&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-semibold">MR</div>
                <div>
                    <p className="text-sm font-medium">Maria Reyes</p>
                    <p className="text-xs text-primary-foreground/60">Business Manager, St. Mary&rsquo;s Parish</p>
                </div>
            </div>
        </div>
    );
}

export function Shell({
    eyebrow,
    title,
    description,
    children,
    footer,
}: {
    eyebrow: string;
    title: string;
    description: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-9">
                <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
    );
}

export const authInputClassName = 'h-14 rounded-xl px-4 text-base';

export function Submit({
    children,
    submitted,
    onClick,
    type = 'button',
}: {
    children: ReactNode;
    submitted?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
}) {
    return (
        <Button type={type} className="h-14 w-full rounded-xl text-base font-semibold" onClick={onClick} isLoading={submitted}>
            {children}
            {submitted ? null : <ArrowRight data-icon="inline-end" />}
        </Button>
    );
}

export function GoogleButton({ onClick, isLoading }: { onClick?: () => void; isLoading?: boolean }) {
    return (
        <Button type="button" variant="outline" isLoading={isLoading} className="h-14 w-full rounded-xl text-base font-medium" onClick={onClick}>
            <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4] shadow-sm">
                G
            </span>
            Continue with Google
        </Button>
    );
}

export function Divider() {
    return (
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}

export function Back({ href, onClick }: { href?: string; onClick?: () => void }) {
    const className = 'inline-flex h-10 items-center gap-1 px-0 text-sm font-medium text-muted-foreground hover:text-foreground';
    if (href) {
        return (
            <Link href={href} className={className}>
                <ArrowLeft data-icon="inline-start" /> Back
            </Link>
        );
    }
    return (
        <Button type="button" variant="ghost" size="sm" onClick={onClick} className="h-10 px-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft data-icon="inline-start" /> Back
        </Button>
    );
}

export function PasswordToggle({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) {
    return (
        <button type="button" aria-label="Toggle password visibility" onClick={() => setShow(!show)} className="absolute right-4 top-4 text-muted-foreground">
            {show ? <EyeOff /> : <Eye />}
        </button>
    );
}
