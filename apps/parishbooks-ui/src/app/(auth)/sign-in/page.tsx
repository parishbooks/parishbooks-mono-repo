import { Suspense } from 'react';
import Link from 'next/link';
import { Divider, Shell } from '@/components/auth/shared';
import { SignInForm } from '@/components/auth/sign-in/sign-in-form';
import { SignInOAuth } from '@/components/auth/sign-in/sign-in-oauth';

export default function SignInPage() {
    return (
        <Shell eyebrow="Welcome back" title="Sign in to continue" description="Enter your details to access your parish's back office.">
            <SignInOAuth />
            <Divider />
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
