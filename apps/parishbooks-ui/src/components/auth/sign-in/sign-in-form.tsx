'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FormField, PasswordToggle, Submit } from '@/components/auth/shared';
import { signIn } from '@/lib/actions/auth';

interface SignInFormValues {
    email: string;
    password: string;
}

export function SignInForm() {
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const verified = searchParams.get('verified') === '1';
    const reset = searchParams.get('reset') === '1';
    const next = searchParams.get('next');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: SignInFormValues) {
        setFormError(null);
        const result = await signIn(values.email, values.password, undefined, next);
        if (!result.success) setFormError(result.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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
                label="Email address"
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address.',
                    },
                })}
            />
            <FormField
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                right={<PasswordToggle show={showPassword} setShow={setShowPassword} />}
                {...register('password', { required: 'Password is required.' })}
            />
            <div className="-mt-2 flex justify-end">
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>
            <Submit type="submit" submitted={isSubmitting}>
                Sign in
            </Submit>
        </form>
    );
}
