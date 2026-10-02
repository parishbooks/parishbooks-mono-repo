import type { Metadata } from 'next';
import { SplitShell } from '@/components/split-shell';

export const metadata: Metadata = {
    title: 'Set up your parish',
    description: 'Create your church workspace in ParishBooks.',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return <SplitShell showSignOut>{children}</SplitShell>;
}
