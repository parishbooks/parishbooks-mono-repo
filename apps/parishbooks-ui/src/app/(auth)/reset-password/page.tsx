import { Shell } from '@/components/auth/shared';
import { ResetPasswordForm } from '@/components/auth/reset-password/reset-password-form';

type ResetPasswordPageProps = {
    searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { email } = await searchParams;

    return (
        <Shell
            eyebrow="Set a new password"
            title="Reset your password"
            description="Enter the email code and choose a strong password you haven't used before."
        >
            <ResetPasswordForm email={email ?? ''} />
        </Shell>
    );
}
