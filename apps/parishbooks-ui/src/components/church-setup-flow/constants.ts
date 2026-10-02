export type WorkspaceCountry = 'IN' | 'US';
export type WorkspaceCurrency = 'INR' | 'USD';

export const DEFAULT_COUNTRY: WorkspaceCountry = 'IN';
export const DEFAULT_CURRENCY: WorkspaceCurrency = 'INR';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const COUNTRY_DEFAULTS: Record<WorkspaceCountry, { timezone: string; currency: WorkspaceCurrency }> = {
    IN: { timezone: DEFAULT_TIMEZONE, currency: 'INR' },
    US: { timezone: 'America/New_York', currency: 'USD' },
};

export const steps = [
    { number: '01', label: 'Your church' },
    { number: '02', label: 'Workspace' },
    { number: '03', label: 'Ready to go' },
];

export const lastStepIndex = steps.length - 1;

export const countryOptions: { value: WorkspaceCountry; title: string; description: string }[] = [
    { value: 'IN', title: 'India', description: 'INR workspace for Indian churches' },
    { value: 'US', title: 'United States', description: 'USD workspace' },
];

export const currencyOptions: { value: WorkspaceCurrency; title: string; description: string }[] = [
    { value: 'INR', title: 'Indian Rupee', description: 'INR' },
    { value: 'USD', title: 'US Dollar', description: 'USD' },
];

export const timezoneOptions: { value: string; label: string; country: WorkspaceCountry }[] = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (Asia/Kolkata)', country: 'IN' },
    { value: 'America/New_York', label: 'Eastern Time (America/New_York)', country: 'US' },
    { value: 'America/Chicago', label: 'Central Time (America/Chicago)', country: 'US' },
    { value: 'America/Denver', label: 'Mountain Time (America/Denver)', country: 'US' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (America/Los_Angeles)', country: 'US' },
];

export const UTC_TIMEZONE = { value: 'UTC', label: 'UTC' } as const;

export function countryLabel(country: WorkspaceCountry): string {
    return countryOptions.find((option) => option.value === country)?.title ?? country;
}

export function timezoneLabel(timezone: string): string {
    if (timezone === UTC_TIMEZONE.value) return UTC_TIMEZONE.label;
    return timezoneOptions.find((option) => option.value === timezone)?.label ?? timezone;
}

export function currencyHint(currency: WorkspaceCurrency, country: WorkspaceCountry): string {
    if (currency === COUNTRY_DEFAULTS[country].currency) return country === 'IN' ? 'Default for India' : 'Default for the United States';
    return currencyOptions.find((option) => option.value === currency)?.description ?? currency;
}

export function timezonesForCountry(country: WorkspaceCountry): { value: string; label: string }[] {
    return [...timezoneOptions.filter((option) => option.country === country), UTC_TIMEZONE];
}
