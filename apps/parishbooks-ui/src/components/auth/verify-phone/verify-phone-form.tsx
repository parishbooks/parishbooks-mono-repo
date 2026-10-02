'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { Back, Submit } from '@/components/auth/shared';

export function VerifyPhoneForm() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);

    function onSubmit() {
        setSubmitted(true);
        window.setTimeout(() => router.push('/sign-in'), 700);
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
                className="flex flex-col items-center gap-6"
            >
                <InputOTP maxLength={6} aria-label="Phone verification code">
                    <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <p className="text-center text-sm text-muted-foreground">
                    Didn&rsquo;t get a code?{' '}
                    <button type="button" className="font-semibold text-primary hover:underline">
                        Resend in 00:42
                    </button>
                </p>
                <Submit type="submit" submitted={submitted}>
                    Verify phone
                </Submit>
            </form>
            <Back onClick={() => router.push('/send-otp')} />
        </>
    );
}
