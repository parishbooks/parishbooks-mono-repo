import { Check } from 'lucide-react';
import { steps } from '../constants';

export function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <div className="mb-10 flex items-center justify-between gap-2">
            {steps.map((item, index) => (
                <div key={item.number} className="flex flex-1 items-center gap-2">
                    <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            index < currentStep
                                ? 'bg-primary text-primary-foreground'
                                : index === currentStep
                                  ? 'bg-primary/10 text-primary ring-4 ring-primary/10'
                                  : 'bg-muted text-muted-foreground'
                        }`}
                    >
                        {index < currentStep ? <Check className="size-4" /> : item.number}
                    </div>
                    <span className={`hidden text-xs font-medium xl:inline ${index === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                    </span>
                    {index < steps.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
                </div>
            ))}
        </div>
    );
}
