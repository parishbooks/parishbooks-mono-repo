'use client';

import { useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { Back, Submit } from '@/components/auth/shared';
import { sendEmailOtp, verifyEmailOtp } from '@/lib/actions/auth';

export function VerifyEmailForm({ email }: { email: string }) {
    const [otp, setOtp] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!email) return;
        void (async () => {
            const result = await sendEmailOtp(email);
            if (!result.success) setFormError(result.error);
        })();
    }, [email]);

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

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!email) {
            setFormError('Missing email. Start again from sign up.');
            return;
        }
        if (otp.length < 6) {
            setFormError('Enter the 6-digit code from your email.');
            return;
        }
        setFormError(null);
        setIsSubmitting(true);
        const result = await verifyEmailOtp(email, otp);
        setIsSubmitting(false);
        if (!result.success) setFormError(result.error);
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
            <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
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
                <InputOTP maxLength={6} value={otp} onChange={setOtp} aria-label="Email verification code">
                    <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <p className="text-center text-sm text-muted-foreground">
                    Didn&rsquo;t get a code?{' '}
                    <button type="button" className="font-semibold text-primary hover:underline" onClick={onResend} disabled={isResending}>
                        {isResending ? 'Sending…' : 'Resend code'}
                    </button>
                </p>
                <Submit type="submit" submitted={isSubmitting}>
                    Verify email
                </Submit>
            </form>
            <Back href="/sign-up" />
        </>
    );
}
