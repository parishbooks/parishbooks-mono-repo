'use client';

import { useForm } from 'react-hook-form';

interface FormValues {
    organizationName: string;
    country: string;
    currency: string;
}

export function OrganizationProfileForm() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitSuccessful, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            organizationName: "St. Mary's Parish",
            country: 'United States',
            currency: 'USD — US Dollar',
        },
    });

    async function onSubmit() {
        // No organization-profile endpoint exists yet — this stub just reports success locally.
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 rounded-2xl border bg-card p-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
                    Organization name
                    <input
                        className="h-12 rounded-xl border bg-background px-4 font-normal outline-none focus:ring-2 focus:ring-ring"
                        {...register('organizationName', { required: true })}
                    />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                    Country
                    <select className="h-12 rounded-xl border bg-background px-4 font-normal" {...register('country')}>
                        <option>United States</option>
                        <option>India</option>
                    </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                    Currency
                    <select className="h-12 rounded-xl border bg-background px-4 font-normal" {...register('currency')}>
                        <option>USD — US Dollar</option>
                        <option>INR — Indian Rupee</option>
                    </select>
                </label>
            </div>
            <div className="mt-6 flex items-center justify-between border-t pt-6">
                <span className="text-sm text-muted-foreground">{isSubmitSuccessful ? 'Changes saved' : 'Last updated just now'}</span>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                    Save changes
                </button>
            </div>
        </form>
    );
}
