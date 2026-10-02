'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@parishbooks/design-system/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';
import { Back, Submit } from '@/components/auth/shared';
import { verifyPhoneDtoSchema, type VerifyPhoneDto } from '@/lib/zod';

export function VerifyPhoneForm() {
    const router = useRouter();

    const form = useForm<VerifyPhoneDto>({
        resolver: zodResolver(verifyPhoneDtoSchema),
        defaultValues: { otp: '' },
    });

    async function onSubmit() {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        router.push('/sign-in');
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-6">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormControl>
                                    <InputOTP maxLength={6} aria-label="Phone verification code" {...field}>
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
                        <button type="button" className="font-semibold text-primary hover:underline">
                            Resend in 00:42
                        </button>
                    </p>
                    <Submit type="submit" submitted={form.formState.isSubmitting}>
                        Verify phone
                    </Submit>
                </form>
            </Form>
            <Back onClick={() => router.push('/send-otp')} />
        </>
    );
}
