'use client';

import { useState } from 'react';
import { GoogleButton } from '@/components/auth/shared';
import { googleSignIn } from '@/lib/actions/auth';

export function SignInOAuth() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    async function onGoogleClick() {
        setError(null);
        setIsLoading(true);
        const result = await googleSignIn();
        if (!result.success) {
            setIsLoading(false);
            setError(result.error);
            return;
        }
        window.location.href = result.data.url;
    }

    return (
        <>
            {error ? (
                <p className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                    {error}
                </p>
            ) : null}
            <GoogleButton isLoading={isLoading} onClick={onGoogleClick} />
        </>
    );
}
