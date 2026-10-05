'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@parishbooks/design-system/ui/button';
import { signOut } from '@/lib/actions/auth';

export function SignOutButton({ variant = 'nav' }: { variant?: 'nav' | 'header' }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    function onSignOut() {
        startTransition(async () => {
            await signOut();
            router.replace('/sign-in');
            router.refresh();
        });
    }

    if (variant === 'header') {
        return (
            <Button
                type="button"
                variant="outline"
                isLoading={pending}
                aria-label="Sign out"
                onClick={onSignOut}
                className="h-10 rounded-xl px-3 font-medium text-muted-foreground hover:text-foreground"
            >
                {pending ? null : <LogOut data-icon="inline-start" />}
                Sign out
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            isLoading={pending}
            onClick={onSignOut}
            className="h-11 w-full justify-start rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
            {pending ? null : <LogOut className="size-4" />}
            Sign out
        </Button>
    );
}
