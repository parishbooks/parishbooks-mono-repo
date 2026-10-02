'use client';

import { Button } from '@parishbooks/design-system/ui/button';

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="max-w-sm text-sm text-muted-foreground">We couldn't load this page. Please try again.</p>
            <Button type="button" onClick={reset}>
                Try again
            </Button>
        </div>
    );
}
