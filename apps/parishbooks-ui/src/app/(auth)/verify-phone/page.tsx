import { Shell } from '@/components/auth/shared';
import { VerifyPhoneForm } from '@/components/auth/verify-phone/verify-phone-form';

export default function VerifyPhonePage() {
    return (
        <Shell eyebrow="Enter verification code" title="Verify your phone" description="We sent a 6-digit code to +1 (•••) •••-4821.">
            <VerifyPhoneForm />
        </Shell>
    );
}
