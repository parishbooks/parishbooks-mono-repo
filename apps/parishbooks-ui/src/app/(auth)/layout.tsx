import { SplitShell } from '@/components/split-shell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <SplitShell>{children}</SplitShell>;
}
