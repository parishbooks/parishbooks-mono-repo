'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, MessageSquare } from 'lucide-react';
import { Back } from '@/components/auth/shared';
import { Button } from '@parishbooks/design-system/ui/button';

export function SendOtpForm() {
    const router = useRouter();

    function onSubmit() {
        router.push('/verify-phone');
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
                className="flex flex-col gap-3"
            >
                <Button type="submit" variant="outline" className="h-20 justify-start gap-4 rounded-xl px-5 text-left">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageSquare />
                    </span>
                    <span className="flex-1">
                        <span className="block text-base font-medium">Text message</span>
                        <span className="text-sm text-muted-foreground">•••••• 4821</span>
                    </span>
                    <ArrowRight />
                </Button>
                <Button type="submit" variant="outline" className="h-20 justify-start gap-4 rounded-xl px-5 text-left">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail />
                    </span>
                    <span className="flex-1">
                        <span className="block text-base font-medium">Email me a code</span>
                        <span className="text-sm text-muted-foreground">m•••@stmarysparish.org</span>
                    </span>
                    <ArrowRight />
                </Button>
            </form>
            <Back onClick={() => router.push('/verify-email')} />
        </>
    );
}
