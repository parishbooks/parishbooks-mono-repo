import { Shell } from '@/components/auth/shared';
import { VerifyEmailForm } from '@/components/auth/verify-email/verify-email-form';

type VerifyEmailPageProps = {
    searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
    const { email } = await searchParams;
    const displayEmail = email?.trim() ?? '';

    return (
        <Shell
            eyebrow="Almost there"
            title="Verify your email"
            description={
                displayEmail ? (
                    <>
                        Enter the 6-digit code we sent to <strong className="font-medium text-foreground">{displayEmail}</strong>.
                    </>
                ) : (
                    'Enter the verification code from your email to continue.'
                )
            }
        >
            <VerifyEmailForm email={displayEmail} />
        </Shell>
    );
}
