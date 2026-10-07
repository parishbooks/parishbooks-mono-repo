import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@parishbooks/design-system/ui/button';

export function EmptyOrganizations() {
    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Create your first organization</h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">Each parish keeps its own books. Start with the one you manage.</p>
            <Link href="/onboarding" className={buttonVariants()}>
                <Plus data-icon="inline-start" />
                Create organization
            </Link>
        </div>
    );
}
