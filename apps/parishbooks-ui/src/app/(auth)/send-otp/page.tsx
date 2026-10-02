import { Shell } from '@/components/auth/shared';
import { SendOtpForm } from '@/components/auth/send-otp/send-otp-form';

export default function SendOtpPage() {
    return (
        <Shell eyebrow="Two-step verification" title="Send a one-time code" description="Choose where you'd like to receive your verification code.">
            <SendOtpForm />
        </Shell>
    );
}
