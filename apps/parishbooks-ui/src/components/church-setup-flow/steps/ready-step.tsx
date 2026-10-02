import { Check } from 'lucide-react';
import { countryLabel, timezoneLabel, type WorkspaceCountry, type WorkspaceCurrency } from '../constants';
import { StepShell } from '../shared';

export function ReadyStep({
    churchName,
    slug,
    country,
    timezone,
    currency,
}: {
    churchName: string;
    slug: string;
    country: WorkspaceCountry;
    timezone: string;
    currency: WorkspaceCurrency;
}) {
    const rows = [
        { label: 'Church', value: churchName || 'Your church' },
        { label: 'Slug', value: slug || '—' },
        { label: 'Country', value: countryLabel(country) },
        { label: 'Timezone', value: timezoneLabel(timezone) },
        { label: 'Currency', value: currency },
    ];

    return (
        <StepShell
            eyebrow="You're all set"
            title={`Welcome, ${churchName || 'your church'}.`}
            description="We'll create your church workspace with these profile defaults. Legal KYC and payouts come after you open the workspace."
        >
            <div className="rounded-2xl border bg-muted/40 p-5">
                <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Check className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold">Review your workspace profile</p>
                        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                            {rows.map((row) => (
                                <div key={row.label}>
                                    <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
                                    <dd className="mt-1 truncate text-sm">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </StepShell>
    );
}
