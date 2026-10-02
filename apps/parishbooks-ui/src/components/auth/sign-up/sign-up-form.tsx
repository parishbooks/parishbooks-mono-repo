'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { authInputClassName, PasswordToggle, Submit } from '@/components/auth/shared';
import { emailSchema, newPasswordSchema } from '@/components/auth/schemas';
import { signUp } from '@/lib/actions/auth';

const signUpSchema = z.object({
    name: z.string().min(1, 'Full name is required.'),
    email: emailSchema,
    password: newPasswordSchema,
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    async function onSubmit(values: SignUpFormValues) {
        setFormError(null);
        const result = await signUp(values.name, values.email, values.password);
        if (!result.success) setFormError(result.error);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                {formError ? (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                        {formError}
                    </p>
                ) : null}
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
