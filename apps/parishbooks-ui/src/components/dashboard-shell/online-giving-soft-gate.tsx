'use client';

import Link from 'next/link';
import { Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { OrganizationCapabilities } from '@/lib/types/organization-capabilities';
import { dashboardPath } from '@/lib/utils/paths';

type StepStatus = 'complete' | 'active' | 'locked';

type OnlineGivingStep = {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    href?: string;
    actionLabel?: string;
};

function buildOnlineGivingSteps(orgSlug: string, data: OrganizationCapabilities): OnlineGivingStep[] {
    const verificationHref = dashboardPath(orgSlug, 'settings/verification');
    const { capabilities: caps, verification } = data;
    const kycComplete = caps.isKycVerified;
    const kycPending = verification.status === 'pending';
    const kycRejected = verification.status === 'rejected';

    let kycStatus: StepStatus = 'locked';
    if (kycComplete) kycStatus = 'complete';
    else if (caps.canSubmitVerification || kycPending || kycRejected) kycStatus = 'active';

    let vendorStatus: StepStatus = 'locked';
    if (caps.canCollectOnlineDonations) vendorStatus = 'complete';
    else if (kycComplete) vendorStatus = 'active';

    let payoutStatus: StepStatus = 'locked';
    if (caps.canReceivePayouts) payoutStatus = 'complete';
    else if (caps.canCollectOnlineDonations) payoutStatus = 'active';

    return [
        {
            id: 'kyc',
            title: 'Complete KYC',
            description: kycRejected
                ? 'Verification was rejected. Update your details and submit again.'
                : kycPending
                  ? 'Your KYC submission is under review (usually 1–3 business days).'
                  : 'Submit parish legal identity, tax ID, and authorized signatory details.',
            status: kycStatus,
            href: verificationHref,
            actionLabel: kycPending ? 'View status' : kycRejected ? 'Fix submission' : 'Continue',
        },
        {
            id: 'vendor',
            title: 'Enable online giving by configuring vendor',
            description: 'Connect your payments vendor so donors can give by card and ACH.',
            status: vendorStatus,
            href: kycComplete ? verificationHref : undefined,
            actionLabel: 'Configure vendor',
        },
        {
            id: 'payout',
            title: 'Configure payout details',
            description: 'Add the bank account where offering and campaign deposits should be sent.',
            status: payoutStatus,
            href: kycComplete ? verificationHref : undefined,
            actionLabel: 'Add payout bank',
        },
    ];
}

function StepBadge({ index, status }: { index: number; status: StepStatus }) {
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

export function OnlineGivingSoftGate({ orgSlug, capabilities }: { orgSlug: string; capabilities: OrganizationCapabilities }) {
    const { capabilities: caps } = capabilities;
    if (caps.canCollectOnlineDonations && caps.canReceivePayouts) return null;
    const steps = buildOnlineGivingSteps(orgSlug, capabilities);
    const nextStep = steps.find((step) => step.status === 'active');
    const verificationHref = dashboardPath(orgSlug, 'settings/verification');

    return (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldAlert className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold tracking-tight">Online giving is not enabled yet</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Work through these steps to accept card donations and receive payouts. Manual donation recording stays available meanwhile.
                    </p>
                    {nextStep ? (
                        <p className="mt-3 text-sm">
                            <span className="font-medium text-foreground">Next: </span>
                            <span className="text-muted-foreground">{nextStep.title}</span>
                        </p>
                    ) : null}
                </div>
            </div>
            <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                    <li
                        key={step.id}
                        className={`flex h-full min-w-0 flex-col rounded-xl border bg-card p-4 ${step.status === 'active' ? 'border-primary/40 bg-primary/5' : ''} ${step.status === 'locked' ? 'opacity-70' : ''}`}
                    >
                        <StepBadge index={index + 1} status={step.status} />
                        <p className="mt-3 text-sm font-medium leading-snug">{step.title}</p>
                        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                        {step.status === 'active' && step.href ? (
                            <Link
                                href={step.href}
                                className="mt-4 inline-flex h-9 w-fit items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                            >
                                {step.actionLabel ?? 'Continue'}
                            </Link>
                        ) : null}
                        {step.status === 'locked' ? (
                            <span className="mt-4 inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs text-muted-foreground">Locked</span>
                        ) : null}
                        {step.status === 'complete' ? <span className="mt-4 text-xs font-medium text-primary">Complete</span> : null}
                    </li>
                ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
                <Link href={verificationHref} className="font-medium text-foreground underline-offset-2 hover:underline">
                    What you&apos;ll need for verification
                </Link>
            </p>
        </div>
    );
}
