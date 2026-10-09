'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, PasswordToggle, Submit } from '@/components/auth/shared';
import { signUpDtoSchema, type SignUpDto } from '@/lib/zod';

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SignUpDto>({
        resolver: zodResolver(signUpDtoSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    function onSubmit(values: SignUpDto) {
        redirect(`/verify-email?email=${encodeURIComponent(values.email)}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input autoComplete="name" placeholder="Maria Reyes" className={authInputClassName} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
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
                <p className="text-xs leading-5 text-muted-foreground">By creating an account, you agree to our Terms and Privacy Policy.</p>
                <Submit type="submit" submitted={form.formState.isSubmitting}>
                    Create account
                </Submit>
            </form>
        </Form>
    );
}
