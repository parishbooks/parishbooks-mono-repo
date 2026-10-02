import { Sparkles } from 'lucide-react';

export function ComingSoon({ title, description }: { title: string; description: string }) {
    return (
        <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center">
            <div className="w-full rounded-3xl border bg-card p-10 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-7" />
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title} is coming soon</h1>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">{description}</p>
                <button className="mt-7 h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Notify me</button>
            </div>
        </div>
    );
}
