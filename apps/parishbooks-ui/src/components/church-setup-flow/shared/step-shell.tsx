import type { ReactNode } from 'react';

export function StepShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-9">
                <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{title}</h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    );
}
