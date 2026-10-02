'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Back, FormField, Submit } from '@/components/auth/shared';
import { resetPassword } from '@/lib/actions/auth';

interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

export function ResetPasswordForm({ token }: { token: string | undefined }) {
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>();

    const password = watch('password');

    async function onSubmit(values: ResetPasswordFormValues) {
        setFormError(null);
        if (!token) {
            setFormError('This reset link is invalid or missing a token. Request a new link from forgot password.');
            return;
        }
        const result = await resetPassword(token, values.password);
        if (!result.success) setFormError(result.error);
    }

    if (!token) {
        return (
            <>
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                    This reset link is invalid or expired. Request a new password reset email.
                </p>
                <Back href="/forgot-password" />
            </>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                {formError ? (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                        {formError}
                    </p>
                ) : null}
                <FormField
                    label="New password"
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required.',
                        minLength: { value: 8, message: 'Use at least 8 characters.' },
                    })}
                />
                <FormField
                    label="Confirm password"
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                        required: 'Please confirm your password.',
                        validate: (value) => value === password || 'Passwords do not match.',
                    })}
                />
                <Submit type="submit" submitted={isSubmitting}>
                    Update password
                </Submit>
            </form>
            <Back href="/forgot-password" />
        </>
    );
}
