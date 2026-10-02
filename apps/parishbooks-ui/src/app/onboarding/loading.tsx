import { Skeleton } from '@parishbooks/design-system/ui/skeleton';
import { steps } from '@/components/church-setup-flow/constants';

export default function OnboardingLoading() {
    return (
        <div className="w-full" aria-busy="true" aria-label="Loading setup">
            <div className="mb-10 flex items-center justify-between gap-2">
                {steps.map((item, index) => (
                    <div key={item.number} className="flex flex-1 items-center gap-2">
                        <Skeleton className="size-9 rounded-full" />
                        {index < steps.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
                    </div>
                ))}
            </div>
            <Skeleton className="mb-4 h-6 w-40 rounded-full" />
            <Skeleton className="mb-3 h-10 w-3/4" />
            <Skeleton className="mb-9 h-4 w-2/3" />
            <div className="flex flex-col gap-6">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
            <div className="mt-9 flex justify-end">
                <Skeleton className="h-14 w-40" />
            </div>
        </div>
    );
}
