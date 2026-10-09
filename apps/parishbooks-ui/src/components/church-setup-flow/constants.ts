export type WorkspaceCountry = 'IN';
export type WorkspaceCurrency = 'INR';

export const DEFAULT_COUNTRY: WorkspaceCountry = 'IN';
export const DEFAULT_CURRENCY: WorkspaceCurrency = 'INR';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const COUNTRY_DEFAULTS: Record<WorkspaceCountry, { timezone: string; currency: WorkspaceCurrency }> = {
    IN: { timezone: DEFAULT_TIMEZONE, currency: 'INR' },
};

export const steps = [
    { number: '01', label: 'Your church' },
    { number: '02', label: 'Workspace' },
    { number: '03', label: 'Ready to go' },
];

export const lastStepIndex = steps.length - 1;

export const countryOptions: { value: WorkspaceCountry; title: string; description: string }[] = [
    { value: 'IN', title: 'India', description: 'INR workspace for Indian churches' },
];

export const currencyOptions: { value: WorkspaceCurrency; title: string; description: string }[] = [
    { value: 'INR', title: 'Indian Rupee', description: 'INR' },
];

/** IANA time zones used in India (all UTC+5:30). */
export const timezoneOptions: { value: string; label: string; country: WorkspaceCountry }[] = [
    { value: 'Asia/Kolkata', label: 'Indian Standard Time — Kolkata (Asia/Kolkata)', country: 'IN' },
    { value: 'Asia/Port_Blair', label: 'Indian Standard Time — Port Blair (Asia/Port_Blair)', country: 'IN' },
];

export function countryLabel(country: WorkspaceCountry): string {
    return countryOptions.find((option) => option.value === country)?.title ?? country;
}

export function timezoneLabel(timezone: string): string {
    return timezoneOptions.find((option) => option.value === timezone)?.label ?? timezone;
}

export function currencyHint(currency: WorkspaceCurrency): string {
    if (currency === DEFAULT_CURRENCY) return 'Default for India';
    return currencyOptions.find((option) => option.value === currency)?.description ?? currency;
}

export function timezonesForCountry(country: WorkspaceCountry): { value: string; label: string }[] {
    return timezoneOptions.filter((option) => option.country === country).map(({ value, label }) => ({ value, label }));
}
