'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, Back, Submit } from '@/components/auth/shared';
import { newPasswordSchema } from '@/components/auth/schemas';
import { resetPassword } from '@/lib/actions/auth';

const resetPasswordSchema = z
    .object({
        password: newPasswordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({ token }: { token: string | undefined }) {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    {formError ? (
                        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                            {formError}
                        </p>
                    ) : null}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        className={authInputClassName}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Repeat your password"
                                        className={authInputClassName}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Submit type="submit" submitted={form.formState.isSubmitting}>
                        Update password
                    </Submit>
                </form>
            </Form>
            <Back href="/forgot-password" />
        </>
    );
}
