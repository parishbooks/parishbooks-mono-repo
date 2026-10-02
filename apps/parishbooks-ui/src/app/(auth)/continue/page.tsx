import { redirect } from 'next/navigation';
import { resolvePostLoginRedirect } from '@/lib/auth/resolve-post-login-redirect';

type ContinuePageProps = {
    searchParams: Promise<{ next?: string }>;
};

export default async function ContinuePage({ searchParams }: ContinuePageProps) {
    const { next } = await searchParams;
    redirect(await resolvePostLoginRedirect(next));
}
