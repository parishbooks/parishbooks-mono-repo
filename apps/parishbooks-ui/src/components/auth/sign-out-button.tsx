'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@parishbooks/design-system/ui/button';

export function SignOutButton({ variant = 'nav' }: { variant?: 'nav' | 'header' }) {
    const router = useRouter();

    function onSignOut() {
        router.push('/sign-in');
    }

    if (variant === 'header') {
        return (
            <Button
                type="button"
                variant="outline"
                aria-label="Sign out"
                onClick={onSignOut}
                className="h-10 rounded-xl px-3 font-medium text-muted-foreground hover:text-foreground"
            >
                <LogOut data-icon="inline-start" />
                Sign out
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onSignOut}
            className="h-11 w-full justify-start rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
            <LogOut className="size-4" />
            Sign out
        </Button>
    );
}
