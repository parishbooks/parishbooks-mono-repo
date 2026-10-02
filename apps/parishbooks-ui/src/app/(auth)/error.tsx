'use client';

import { Button } from '@parishbooks/design-system/ui/button';

export default function AuthError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="max-w-sm text-sm text-muted-foreground">We couldn't complete that request. Please try again.</p>
            <Button type="button" onClick={reset}>
                Try again
            </Button>
        </div>
    );
}
