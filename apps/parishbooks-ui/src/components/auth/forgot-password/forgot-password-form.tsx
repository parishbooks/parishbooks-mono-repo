'use client';

import Link from 'next/link';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, Back, FormError, Submit } from '@/components/auth/shared';
import { forgotPassword } from '@/lib/actions/auth';
import { pathForRedirect } from '@/lib/utils/redirect';
import { forgotPasswordDtoSchema, type ForgotPasswordDto } from '@/lib/zod';

export function ForgotPasswordForm() {
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
        redirect(pathForRedirect(result.data.redirectTo ?? 'password-reset', values.email));
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                    <FormError>{formError}</FormError>
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
                        Send reset code
                    </Submit>
                </form>
            </Form>
            <Back href="/sign-in" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link href="/sign-in" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </>
    );
}
