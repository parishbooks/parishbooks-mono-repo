'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@parishbooks/design-system/ui/button';
import { Input } from '@parishbooks/design-system/ui/input';
import { useOrg } from '@/lib/context/org';
import type { OrganizationVerificationStatus } from '@/lib/types/organization-capabilities';
import { dashboardPath } from '@/lib/utils/paths';

type HubStepId = 'organization' | 'legal_tax' | 'bank_payouts' | 'review';

type HubStep = {
    id: HubStepId;
    label: string;
    status: 'complete' | 'in_progress' | 'not_started';
};

function hubStepsFromVerification(status: OrganizationVerificationStatus): HubStep[] {
    const organization: HubStep = { id: 'organization', label: 'Organization', status: 'complete' };
    if (status === 'not_started') {
        return [
            organization,
            { id: 'legal_tax', label: 'Legal & tax', status: 'in_progress' },
            { id: 'bank_payouts', label: 'Bank payouts', status: 'not_started' },
            { id: 'review', label: 'Review', status: 'not_started' },
        ];
    }
    if (status === 'pending') {
        return [
            organization,
            { id: 'legal_tax', label: 'Legal & tax', status: 'complete' },
            { id: 'bank_payouts', label: 'Bank payouts', status: 'complete' },
            { id: 'review', label: 'Review', status: 'in_progress' },
        ];
    }
    if (status === 'active') {
        return [
            organization,
            { id: 'legal_tax', label: 'Legal & tax', status: 'complete' },
            { id: 'bank_payouts', label: 'Bank payouts', status: 'complete' },
            { id: 'review', label: 'Review', status: 'complete' },
        ];
    }
    return [
        organization,
        { id: 'legal_tax', label: 'Legal & tax', status: 'in_progress' },
        { id: 'bank_payouts', label: 'Bank payouts', status: 'not_started' },
        { id: 'review', label: 'Review', status: 'not_started' },
    ];
}

function statusLabel(status: HubStep['status']) {
    if (status === 'complete') return 'Done';
    if (status === 'in_progress') return 'In progress';
    return 'Not started';
}

function verificationHeadline(status: OrganizationVerificationStatus) {
    if (status === 'pending') return 'Verification under review';
    if (status === 'active') return 'Parish verified';
    if (status === 'rejected') return 'Verification needs attention';
    return 'Verify your parish';
}

function verificationDescription(status: OrganizationVerificationStatus) {
    if (status === 'pending') return 'We are reviewing your submission. You can still manage members and funds while you wait.';
    if (status === 'active') return 'Online donations and payouts are enabled for this workspace.';
    if (status === 'rejected') return 'Update the details below and submit again.';
    return 'Submit legal and payout information so ParishBooks can enable online giving.';
}

export function VerificationHub() {
    const { orgSlug, capabilities } = useOrg();
    if (!capabilities) redirect('/onboarding');
    const { verification } = capabilities;
    const steps = hubStepsFromVerification(verification.status);
    const submitDisabled = !capabilities.capabilities.canSubmitVerification;

    return (
        <div className="mx-auto max-w-3xl">
            <Link href={dashboardPath(orgSlug)} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" />
                Back to overview
            </Link>
            <p className="mt-6 text-sm font-medium text-primary">Settings / Verification</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{verificationHeadline(verification.status)}</h1>
            <p className="mt-2 text-muted-foreground">{verificationDescription(verification.status)}</p>
            {verification.status === 'rejected' && verification.rejectionReason ? (
                <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {verification.rejectionReason}
                </div>
            ) : null}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => (
                    <div key={step.id} className={`rounded-xl border p-3 ${step.status === 'in_progress' ? 'border-primary/40 bg-primary/5' : 'bg-card'}`}>
                        <p className="text-xs font-medium text-muted-foreground">{step.label}</p>
                        <p className="mt-1 text-sm font-semibold">{statusLabel(step.status)}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 rounded-2xl border bg-card p-6">
                <h2 className="text-lg font-semibold">Legal & tax information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Step 2 of 4 — stub form until verification APIs are wired.</p>
                <div className="mt-6 flex flex-col gap-4">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Legal parish name</span>
                        <Input placeholder="St. Mary's Catholic Church" disabled={verification.status === 'pending'} />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Tax ID / EIN</span>
                        <Input placeholder="XX-XXXXXXX" disabled={verification.status === 'pending'} />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Registered address</span>
                        <Input placeholder="Street, city, state, ZIP" disabled={verification.status === 'pending'} />
                    </label>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button type="button" variant="outline" disabled={verification.status === 'pending'}>
                        Save draft
                    </Button>
                    <Button type="button" disabled={submitDisabled || verification.status === 'pending'}>
                        Submit for review
                    </Button>
                </div>
            </div>
            <div className="mt-6 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                While verification is pending, you can still add members, configure funds, and record donations manually.
            </div>
        </div>
    );
}
