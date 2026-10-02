import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@parishbooks/design-system/ui/button';
import { lastStepIndex } from '../constants';

const navButtonClassName = 'h-14 min-w-40 rounded-xl px-6 text-base font-semibold';

export function SetupNav({
    step,
    canContinue = true,
    isLoading = false,
    onBack,
    onNext,
}: {
    step: number;
    canContinue?: boolean;
    isLoading?: boolean;
    onBack: () => void;
    onNext: () => void;
}) {
    return (
        <div className="mt-9 flex items-center justify-between gap-3">
            {step > 0 ? (
                <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className={navButtonClassName}>
                    <ArrowLeft data-icon="inline-start" /> Back
                </Button>
            ) : (
                <span />
            )}
            {step < lastStepIndex ? (
                <Button type="button" onClick={onNext} disabled={!canContinue} className={navButtonClassName}>
                    Continue <ArrowRight data-icon="inline-end" />
                </Button>
            ) : (
                <Button type="button" onClick={onNext} isLoading={isLoading} className={navButtonClassName}>
                    Open workspace <ArrowRight data-icon="inline-end" />
                </Button>
            )}
        </div>
    );
}
