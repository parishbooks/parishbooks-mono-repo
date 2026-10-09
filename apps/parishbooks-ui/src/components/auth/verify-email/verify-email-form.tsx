'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@parishbooks/design-system/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { Back, FormStatus, Submit } from '@/components/auth/shared';
import { verifyEmailDtoSchema, type VerifyEmailDto } from '@/lib/zod';

export function VerifyEmailForm({ email }: { email: string }) {
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const form = useForm<VerifyEmailDto>({
        resolver: zodResolver(verifyEmailDtoSchema),
        defaultValues: { otp: '' },
    });

    function onResend() {
        setResendMessage('A new code was sent to your email.');
    }

    function onSubmit() {
        redirect('/sign-in?verified=1');
    }

    if (!email) {
        return (
            <>
                <p className="text-sm text-destructive">We could not determine your email address. Please sign up again.</p>
                <Back href="/sign-up" />
            </>
        );
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
                    <FormStatus className="w-full">{resendMessage}</FormStatus>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormControl>
                                    <InputOTP maxLength={6} aria-label="Email verification code" {...field}>
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
                    <p className="text-center text-sm text-muted-foreground">
                        Didn&rsquo;t get a code?{' '}
                        <button type="button" className="font-semibold text-primary hover:underline" onClick={onResend}>
                            Resend code
                        </button>
                    </p>
                    <Submit type="submit" submitted={form.formState.isSubmitting}>
                        Verify email
                    </Submit>
                </form>
            </Form>
            <Back href="/sign-up" />
        </>
    );
}
