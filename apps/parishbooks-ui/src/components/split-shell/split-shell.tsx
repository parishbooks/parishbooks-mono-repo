import type { ReactNode } from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';
import { ModeToggle } from '@parishbooks/design-system/mode-toggle';
import { SiteBrand } from '@parishbooks/site-ui';
import { Testimonial } from '@/components/auth/shared';
import { SignOutButton } from '@/components/auth/sign-out-button';

export function SplitShell({ children, showSignOut = false }: { children: ReactNode; showSignOut?: boolean }) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <header className="flex items-center justify-between border-b border-border/60 px-6 py-5 sm:px-10">
                <SiteBrand href="/sign-in" className="text-base" />
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
                        <span className="size-2 rounded-full bg-emerald-500" /> Trusted by parishes nationwide
                    </div>
                    {showSignOut ? <SignOutButton variant="header" /> : null}
                    <ModeToggle />
                </div>
            </header>
            <div className="grid flex-1 lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
                    <div className="absolute -right-24 -top-24 size-80 rounded-full border border-primary-foreground/10 bg-primary-foreground/5" />
                    <div className="absolute -bottom-32 -left-20 size-96 rounded-full border border-primary-foreground/10 bg-primary-foreground/5" />
                    <div className="relative">
                        <p className="mb-6 text-sm font-medium text-primary-foreground/70">The back office built for parishes</p>
                        <h2 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.05em] xl:text-5xl">Keep your parish books in order.</h2>
                        <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">
                            Manage offertory, expenses, and reporting for your parish in one secure, easy-to-use workspace.
                        </p>
                    </div>
                    <div className="relative flex flex-col gap-4">
                        <Testimonial />
                        <div className="flex gap-6 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/70">
                            <span className="flex items-center gap-2">
                                <Landmark className="size-4" /> 500+ parishes
                            </span>
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="size-4" /> Bank-level security
                            </span>
                        </div>
                    </div>
                </aside>
                <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
                    <div className="w-full max-w-2xl">{children}</div>
                </section>
            </div>
        </div>
    );
}
