'use client';

import { useState } from 'react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@parishbooks/design-system/ui/input';
import { Label } from '@parishbooks/design-system/ui/label';
import { authInputClassName, FormStatus, PasswordToggle, Submit } from '@/components/auth/shared';
import { signInDtoSchema, type SignInDto } from '@/lib/zod';

export function SignInForm() {
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    const verified = searchParams.get('verified') === '1';
    const reset = searchParams.get('reset') === '1';

    const form = useForm<SignInDto>({ resolver: zodResolver(signInDtoSchema), defaultValues: { email: '', password: '' } });
    const { errors } = form.formState;

    function onSubmit() {
        redirect('/dashboard');
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" autoComplete="on" noValidate>
            {verified ? <FormStatus>Email verified. Sign in to continue.</FormStatus> : null}
            {reset ? <FormStatus>Password updated. Sign in with your new password.</FormStatus> : null}
            <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    {...form.register('email')}
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="you@example.com"
                    className={authInputClassName}
                    aria-invalid={errors.email ? true : undefined}
                />
                {errors.email?.message ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        {...form.register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className={`${authInputClassName} pr-12`}
                        aria-invalid={errors.password ? true : undefined}
                    />
                    <PasswordToggle show={showPassword} setShow={setShowPassword} />
                </div>
                {errors.password?.message ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
            </div>
            <div className="-mt-2 flex justify-end">
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>
            <Submit type="submit" submitted={form.formState.isSubmitting}>
                Sign in
            </Submit>
        </form>
    );
}
