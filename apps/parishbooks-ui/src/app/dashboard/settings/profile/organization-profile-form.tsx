'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@parishbooks/design-system/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@parishbooks/design-system/ui/select';
import {
    COUNTRY_DEFAULTS,
    countryOptions,
    currencyOptions,
    timezonesForCountry,
    type WorkspaceCountry,
    type WorkspaceCurrency,
} from '@/components/church-setup-flow/constants';
import { Choice, IndiaFlag, UsaFlag } from '@/components/church-setup-flow/shared';

const organizationProfileSchema = z.object({
    organizationName: z.string().min(1, 'Organization name is required.'),
    country: z.enum(['IN', 'US']),
    timezone: z.string().min(1, 'Timezone is required.'),
    currency: z.enum(['INR', 'USD']),
});

export type OrganizationProfileFormValues = z.infer<typeof organizationProfileSchema>;

function countryFlag(country: WorkspaceCountry) {
    if (country === 'IN') return <IndiaFlag className="block size-full" />;
    return <UsaFlag className="block size-full" />;
}

function currencyLabel(value: WorkspaceCurrency) {
    const option = currencyOptions.find((item) => item.value === value);
    if (!option) return value;
    return `${option.description} — ${option.title}`;
}

function formatUpdatedAt(updatedAt: string | null | undefined): string {
    if (!updatedAt) return 'Last updated unknown';
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return 'Last updated unknown';
    return `Last updated ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)}`;
}

type OrganizationProfileFormProps = {
    defaultValues: OrganizationProfileFormValues;
    updatedAt?: string | null;
};

export function OrganizationProfileForm({ defaultValues, updatedAt }: OrganizationProfileFormProps) {
    const form = useForm<OrganizationProfileFormValues>({
        resolver: zodResolver(organizationProfileSchema),
        defaultValues,
    });

    const country = form.watch('country');
    const timezoneChoices = timezonesForCountry(country);

    function applyCountry(value: WorkspaceCountry) {
        const defaults = COUNTRY_DEFAULTS[value];
        form.setValue('country', value);
        form.setValue('timezone', defaults.timezone);
        form.setValue('currency', defaults.currency);
    }

    async function onSubmit() {
        // No organization-profile update endpoint exists yet — this stub just reports success locally.
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 rounded-2xl border bg-card p-6">
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organization name</FormLabel>
                                <FormControl>
                                    <Input className="h-12 rounded-xl" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {countryOptions.map((option) => (
                                        <Choice
                                            key={option.value}
                                            active={field.value === option.value}
                                            onClick={() => applyCountry(option.value)}
                                            leading={countryFlag(option.value)}
                                            title={option.title}
                                            description={option.description}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="timezone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timezone</FormLabel>
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="organization-timezone" className="h-12 w-full min-w-[120px] rounded-xl">
                                            <SelectValue placeholder="Select timezone">
                                                {timezoneChoices.find((option) => option.value === field.value)?.label ?? field.value}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezoneChoices.map((option) => (
                                                <SelectItem key={option.value} value={option.value} label={option.label}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select name={field.name} value={field.value} onValueChange={(value) => field.onChange(value as WorkspaceCurrency)}>
                                        <SelectTrigger id="organization-currency" className="h-12 w-full min-w-[120px] rounded-xl">
                                            <SelectValue placeholder="Select currency">{currencyLabel(field.value)}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value} label={`${option.description} — ${option.title}`}>
                                                    {option.description} — {option.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-6">
                    <span className="text-sm text-muted-foreground">{form.formState.isSubmitSuccessful ? 'Changes saved' : formatUpdatedAt(updatedAt)}</span>
                    <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 rounded-xl px-5">
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}
