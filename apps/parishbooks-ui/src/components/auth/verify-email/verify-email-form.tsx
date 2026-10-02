'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@parishbooks/design-system/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { Back, Submit } from '@/components/auth/shared';
import { sendEmailOtp, verifyEmailOtp } from '@/lib/actions/auth';
import { verifyEmailDtoSchema, type VerifyEmailDto } from '@/lib/zod';

export function VerifyEmailForm({ email }: { email: string }) {
    const [formError, setFormError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);

    const form = useForm<VerifyEmailDto>({
        resolver: zodResolver(verifyEmailDtoSchema),
        defaultValues: { otp: '' },
    });

    async function onResend() {
        if (!email) return;
        setFormError(null);
        setResendMessage(null);
        setIsResending(true);
        const result = await sendEmailOtp(email);
        setIsResending(false);
        if (!result.success) setFormError(result.error);
        else setResendMessage('A new code was sent to your email.');
    }

    async function onSubmit(values: VerifyEmailDto) {
        if (!email) {
            setFormError('Missing email. Start again from sign up.');
            return;
        }
        setFormError(null);
        const result = await verifyEmailOtp(email, values.otp);
        if (!result.success) {
            setFormError(result.error);
            return;
        }
        redirect(result.data.destination);
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
                    {formError ? (
                        <p className="w-full rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                            {formError}
                        </p>
                    ) : null}
                    {resendMessage ? (
                        <p className="w-full rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground" role="status">
                            {resendMessage}
                        </p>
                    ) : null}
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
                        <button type="button" className="font-semibold text-primary hover:underline" onClick={onResend} disabled={isResending}>
                            {isResending ? 'Sending…' : 'Resend code'}
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
