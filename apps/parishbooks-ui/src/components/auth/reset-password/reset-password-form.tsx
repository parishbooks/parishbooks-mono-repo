'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@parishbooks/design-system/ui/form';
import { Input } from '@parishbooks/design-system/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { authInputClassName, Back, FormError, Submit } from '@/components/auth/shared';
import { resetPassword } from '@/lib/actions/auth';
import { pathForRedirect } from '@/lib/utils/redirect';
import { resetPasswordDtoSchema, type ResetPasswordDto } from '@/lib/zod';

export function ResetPasswordForm({ email }: { email: string }) {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<ResetPasswordDto>({
        resolver: zodResolver(resetPasswordDtoSchema),
        defaultValues: { otp: '', password: '', confirmPassword: '' },
    });

    async function onSubmit(values: ResetPasswordDto) {
        setFormError(null);
        if (!email) {
            setFormError('Missing email. Request a new password reset.');
            return;
        }
        const result = await resetPassword({ email, otp: values.otp, password: values.password });
        if (!result.success) {
            setFormError(result.error);
            return;
        }
        redirect(`${pathForRedirect(result.data.redirectTo ?? 'sign-in')}?reset=1`);
    }

    if (!email) {
        return (
            <>
                <FormError>This reset link is missing an email. Request a new password reset.</FormError>
                <Back href="/forgot-password" />
            </>
        );
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    <FormError>{formError}</FormError>
                    <p className="text-sm text-muted-foreground">
                        Enter the code sent to <span className="font-medium text-foreground">{email}</span>.
                    </p>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormLabel>Reset code</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} aria-label="Password reset code" {...field}>
                                        <InputOTPGroup>
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
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
