'use client';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { DashboardHeaderActions } from './dashboard-header-actions';

export interface DashboardShellProps {
    children: React.ReactNode;
}

/** Workspace picker chrome: header only, content spans the full width. */
export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-card/90 px-5 backdrop-blur md:px-8">
                <DashboardHeaderActions />
                <SignOutButton variant="header" />
            </header>
            <main className="min-h-[calc(100vh-5rem)] p-5 md:p-8">{children}</main>
        </div>
    );
}
