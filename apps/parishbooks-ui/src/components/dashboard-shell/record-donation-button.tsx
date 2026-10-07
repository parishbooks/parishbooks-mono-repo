'use client';

import Link from 'next/link';
import type { OrganizationCapabilities } from '@/lib/types/organization-capabilities';
import { dashboardPath } from '@/lib/utils/paths';

type RecordDonationButtonProps = {
    orgSlug: string;
    capabilities: OrganizationCapabilities | null;
    className?: string;
};

export function RecordDonationButton({ orgSlug, capabilities, className = '' }: RecordDonationButtonProps) {
    const caps = capabilities?.capabilities;
    const canRecordManually = caps?.canRecordDonationsManually ?? true;
    const onlineEnabled = caps?.canCollectOnlineDonations ?? false;
    const verificationHref = dashboardPath(orgSlug, 'settings/verification');

    const baseClass = 'h-11 rounded-xl px-5 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50';
    const enabledClass = `${baseClass} bg-primary text-primary-foreground ${className}`;

    if (!canRecordManually) {
        return (
            <button type="button" className={enabledClass} disabled title="Workspace billing is locked">
                Record donation
            </button>
        );
    }

    if (!onlineEnabled) {
        return (
            <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
                <button type="button" className={enabledClass} title="Manual entry only until parish verification is approved">
                    Record donation
                </button>
                <p className="text-xs text-muted-foreground sm:text-right">
                    Manual entry only.{' '}
                    <Link href={verificationHref} className="font-medium text-foreground underline-offset-2 hover:underline">
                        Verify parish
                    </Link>{' '}
                    for online giving.
                </p>
            </div>
        );
    }

    return (
        <button type="button" className={enabledClass}>
            Record donation
        </button>
    );
}
