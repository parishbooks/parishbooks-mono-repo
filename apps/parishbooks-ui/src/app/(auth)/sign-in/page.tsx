import Link from 'next/link';
import { Suspense } from 'react';
import { Shell } from '@/components/auth/shared';
import { SignInForm } from '@/components/auth/sign-in/sign-in-form';

export default function SignInPage() {
    return (
        <Shell eyebrow="Welcome back" title="Sign in to continue" description="Enter your details to access your parish's back office.">
            <Suspense fallback={null}>
                <SignInForm />
            </Suspense>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                New to ParishBooks?{' '}
                <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                    Create an account
                </Link>
            </div>
        </Shell>
    );
}
