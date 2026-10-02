'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, Back, Submit } from '@/components/auth/shared';
import { forgotPassword } from '@/lib/actions/auth';
import { forgotPasswordDtoSchema, type ForgotPasswordDto } from '@/lib/zod';

export function ForgotPasswordForm() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<ForgotPasswordDto>({
        resolver: zodResolver(forgotPasswordDtoSchema),
        defaultValues: { email: '' },
    });

    async function onSubmit(values: ForgotPasswordDto) {
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                    {formError ? (
                        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                            {formError}
                        </p>
                    ) : null}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input type="email" autoComplete="email" placeholder="you@example.com" className={authInputClassName} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Submit type="submit" submitted={form.formState.isSubmitting}>
                        Send reset link
                    </Submit>
                </form>
            </Form>
            <Back href="/sign-in" />
        </>
    );
}
