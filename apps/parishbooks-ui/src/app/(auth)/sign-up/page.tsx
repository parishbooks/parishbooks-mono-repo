import Link from 'next/link';
import { Divider, Shell } from '@/components/auth/shared';
import { SignUpForm } from '@/components/auth/sign-up/sign-up-form';
import { SignUpOAuth } from '@/components/auth/sign-up/sign-up-oauth';

export default function SignUpPage() {
    return (
        <Shell eyebrow="Get started" title="Create your account" description="Join hundreds of parishes managing their finances with confidence.">
            <SignUpOAuth />
            <Divider />
            <SignUpForm />
            <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </Shell>
    );
}
