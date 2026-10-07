'use client';

import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';
import type { OrganizationCapabilities } from '@/lib/types/organization-capabilities';
import { dashboardPath } from '@/lib/utils/paths';

type SetupStepStatus = 'complete' | 'active' | 'locked';

type SetupStep = {
    id: string;
    title: string;
    description: string;
    status: SetupStepStatus;
    href?: string;
};

function buildSetupSteps(orgSlug: string, data: OrganizationCapabilities): SetupStep[] {
    const verificationHref = dashboardPath(orgSlug, 'settings/verification');
    const { capabilities, verification } = data;
    const kycComplete = capabilities.isKycVerified;
    const kycPending = verification.status === 'pending';
    const kycRejected = verification.status === 'rejected';

    let verifyStatus: SetupStepStatus = 'locked';
    if (kycComplete) verifyStatus = 'complete';
    else if (capabilities.canSubmitVerification || kycPending || kycRejected) verifyStatus = 'active';

    const payoutStatus: SetupStepStatus = kycComplete ? 'active' : 'locked';
    const donationStatus: SetupStepStatus = kycComplete ? 'active' : capabilities.canRecordDonationsManually ? 'active' : 'locked';

    return [
        {
            id: 'verify_parish',
            title: 'Verify parish identity (KYC)',
            description: kycRejected
                ? 'Verification was rejected. Review details and submit again.'
                : kycPending
                  ? 'Your submission is under review (usually 1–3 business days).'
                  : 'Legal name, tax ID, and authorized signatory.',
            status: verifyStatus,
            href: verificationHref,
        },
        {
            id: 'connect_payout_bank',
            title: 'Connect payout bank account',
            description: 'Available after parish verification is approved.',
            status: payoutStatus,
            href: kycComplete ? verificationHref : undefined,
        },
        {
            id: 'record_first_donation',
            title: 'Record your first donation',
            description: kycComplete ? 'Manual entry and online giving are available.' : 'Manual entry works today; online giving unlocks after verification.',
            status: donationStatus,
            href: dashboardPath(orgSlug, 'giving'),
        },
    ];
}

function StepBadge({ index, status }: { index: number; status: SetupStepStatus }) {
    if (status === 'complete') {
        return (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                <ShieldCheck className="size-3.5" />
            </span>
        );
    }
    return (
        <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
            {status === 'locked' ? <Lock className="size-3.5" /> : index}
        </span>
    );
}

export function SetupChecklist({ orgSlug, capabilities }: { orgSlug: string; capabilities: OrganizationCapabilities }) {
    const steps = buildSetupSteps(orgSlug, capabilities);
    const nextStep = steps.find((step) => step.status === 'active');

    return (
        <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Get started</h2>
            <p className="mt-1 text-sm text-muted-foreground">Finish setup to unlock online giving and payouts.</p>
            {nextStep ? (
                <p className="mt-3 text-sm">
                    <span className="font-medium text-foreground">Next: </span>
                    <span className="text-muted-foreground">{nextStep.title}</span>
                </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-4">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 ${step.status === 'active' ? 'border-primary/40 bg-primary/5' : ''} ${step.status === 'locked' ? 'opacity-70' : ''}`}
                    >
                        <StepBadge index={index + 1} status={step.status} />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{step.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                            {step.status === 'active' && step.href ? (
                                <Link
                                    href={step.href}
                                    className="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                                >
                                    Continue
                                </Link>
                            ) : null}
                            {step.status === 'locked' ? (
                                <span className="mt-3 inline-flex items-center rounded-md border px-2 py-1 text-xs text-muted-foreground">Locked</span>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
