'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, PasswordToggle, Submit } from '@/components/auth/shared';
import { emailSchema, requiredPasswordSchema } from '@/components/auth/schemas';
import { signIn } from '@/lib/actions/auth';

const signInSchema = z.object({
    email: emailSchema,
    password: requiredPasswordSchema,
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const verified = searchParams.get('verified') === '1';
    const reset = searchParams.get('reset') === '1';
    const next = searchParams.get('next');

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: SignInFormValues) {
        setFormError(null);
        const result = await signIn(values.email, values.password, undefined, next);
        if (!result.success) setFormError(result.error);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                {verified ? (
                    <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground" role="status">
                        Email verified. Sign in to continue.
                    </p>
                ) : null}
                {reset ? (
                    <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground" role="status">
                        Password updated. Sign in with your new password.
                    </p>
                ) : null}
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className={`${authInputClassName} pr-12`}
                                        {...field}
                                    />
                                </FormControl>
                                <PasswordToggle show={showPassword} setShow={setShowPassword} />
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="-mt-2 flex justify-end">
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Submit type="submit" submitted={form.formState.isSubmitting}>
                    Sign in
                </Submit>
            </form>
        </Form>
    );
}
