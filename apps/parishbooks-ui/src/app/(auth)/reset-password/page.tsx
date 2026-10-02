import { Shell } from '@/components/auth/shared';
import { ResetPasswordForm } from '@/components/auth/reset-password/reset-password-form';

type ResetPasswordPageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { token } = await searchParams;

    return (
        <Shell eyebrow="Set a new password" title="Reset your password" description="Choose a strong password you haven't used before.">
            <ResetPasswordForm token={token} />
        </Shell>
    );
}
