import { Banknote, ChevronDown, Clock } from 'lucide-react';
import { countryOptions, currencyHint, currencyOptions, timezonesForCountry, type WorkspaceCountry, type WorkspaceCurrency } from '../constants';
import { Choice, Field, IndiaFlag, StepShell, UsaFlag } from '../shared';

export function WorkspaceStep({
    country,
    timezone,
    currency,
    onCountryChange,
    onTimezoneChange,
    onCurrencyChange,
}: {
    country: WorkspaceCountry;
    timezone: string;
    currency: WorkspaceCurrency;
    onCountryChange: (value: WorkspaceCountry) => void;
    onTimezoneChange: (value: string) => void;
    onCurrencyChange: (value: WorkspaceCurrency) => void;
}) {
    const timezoneChoices = timezonesForCountry(country);

    return (
        <StepShell
            eyebrow="Workspace defaults"
            title="Where is your church based?"
            description="Country, timezone, and currency are saved on your organization profile. You can change them later."
        >
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Country</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {countryOptions.map((option) => (
                            <Choice
                                key={option.value}
                                active={country === option.value}
                                onClick={() => onCountryChange(option.value)}
                                leading={option.value === 'IN' ? <IndiaFlag className="block size-full" /> : <UsaFlag className="block size-full" />}
                                title={option.title}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>
                <Field id="workspace-timezone" label="Timezone">
                    <div className="relative">
                        <Clock className="pointer-events-none absolute left-4 top-4 size-5 text-muted-foreground" />
                        <select
                            id="workspace-timezone"
                            value={timezone}
                            onChange={(event) => onTimezoneChange(event.target.value)}
                            className="h-14 w-full cursor-pointer appearance-none rounded-xl border border-input bg-input/30 py-2 pr-10 pl-12 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            {timezoneChoices.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-4 size-5 text-muted-foreground" />
                    </div>
                </Field>
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Currency</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {currencyOptions.map((option) => (
                            <Choice
                                key={option.value}
                                active={currency === option.value}
                                onClick={() => onCurrencyChange(option.value)}
                                icon={Banknote}
                                title={option.title}
                                description={currencyHint(option.value, country)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </StepShell>
    );
}
