'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, PasswordToggle, Submit } from '@/components/auth/shared';
import { signUp } from '@/lib/actions/auth';

interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
}

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        defaultValues: { name: '', email: '', password: '' },
    });

    async function onSubmit(values: SignUpFormValues) {
        setFormError(null);
        const result = await signUp(values.name, values.email, values.password);
        if (!result.success) setFormError(result.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {formError ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                    {formError}
                </p>
            ) : null}
            <FormField
                label="Full name"
                id="name"
                autoComplete="name"
                placeholder="Maria Reyes"
                error={errors.name?.message}
                {...register('name', { required: 'Full name is required.' })}
            />
            <FormField
                label="Email address"
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required.',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
                })}
            />
            <FormField
                label="Password"
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                error={errors.password?.message}
                right={<PasswordToggle show={showPassword} setShow={setShowPassword} />}
                {...register('password', {
                    required: 'Password is required.',
                    minLength: { value: 8, message: 'Use at least 8 characters.' },
                })}
            />
            <p className="text-xs leading-5 text-muted-foreground">By creating an account, you agree to our Terms and Privacy Policy.</p>
            <Submit type="submit" submitted={isSubmitting}>
                Create account
            </Submit>
        </form>
    );
}
