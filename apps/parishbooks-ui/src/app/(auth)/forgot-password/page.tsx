import { Shell } from '@/components/auth/shared';
import { ForgotPasswordForm } from '@/components/auth/forgot-password/forgot-password-form';

export default function ForgotPasswordPage() {
    return (
        <Shell eyebrow="Account recovery" title="Forgot your password?" description="No worries. Enter your email and we'll send you a link to reset it.">
            <ForgotPasswordForm />
        </Shell>
    );
}
