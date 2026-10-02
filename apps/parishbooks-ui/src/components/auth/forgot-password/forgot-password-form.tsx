'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Back, FormField, Submit } from '@/components/auth/shared';
import { forgotPassword } from '@/lib/actions/auth';

interface ForgotPasswordFormValues {
    email: string;
}

export function ForgotPasswordForm() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: { email: '' },
    });

    async function onSubmit(values: ForgotPasswordFormValues) {
        setFormError(null);
        const result = await forgotPassword(values.email);
        if (!result.success) {
            setFormError(result.error);
            return;
        }
        setSuccessMessage(result.data.message);
    }

    if (successMessage) {
        return (
            <>
                <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground" role="status">
                    {successMessage}
                </p>
                <Link href="/sign-in" className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
                    Back to sign in
                </Link>
            </>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                {formError ? (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                        {formError}
                    </p>
                ) : null}
                <FormField
                    label="Email address"
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                        required: 'Email is required.',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
                    })}
                />
                <Submit type="submit" submitted={isSubmitting}>
                    Send reset link
                </Submit>
            </form>
            <Back href="/sign-in" />
        </>
    );
}
