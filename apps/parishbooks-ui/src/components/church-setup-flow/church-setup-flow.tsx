'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { slugFromName, isValidChurchName, isValidSlug } from '@/lib/utils/slug';
import {
    COUNTRY_DEFAULTS,
    DEFAULT_COUNTRY,
    DEFAULT_CURRENCY,
    DEFAULT_TIMEZONE,
    lastStepIndex,
    type WorkspaceCountry,
    type WorkspaceCurrency,
} from './constants';
import { SetupNav, StepIndicator } from './layout';
import { ChurchDetailsStep, ReadyStep, WorkspaceStep } from './steps';

export function ChurchSetupFlow() {
    const [step, setStep] = useState(0);
    const [churchName, setChurchName] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [country, setCountry] = useState<WorkspaceCountry>(DEFAULT_COUNTRY);
    const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
    const [currency, setCurrency] = useState<WorkspaceCurrency>(DEFAULT_CURRENCY);

    const canContinue = step === 0 ? isValidChurchName(churchName) && isValidSlug(slug) : true;

    const next = () => {
        if (!canContinue) return;
        setStep((current) => Math.min(current + 1, lastStepIndex));
    };
    const back = () => {
        setStep((current) => Math.max(current - 1, 0));
    };

    const handleChurchNameChange = (value: string) => {
        setChurchName(value);
        if (!slugTouched) setSlug(slugFromName(value));
    };

    const handleSlugChange = (value: string) => {
        setSlugTouched(true);
        setSlug(value.toLowerCase());
    };

    const handleSlugBlur = () => {
        const next = slugFromName(slug);
        if (next) setSlug(next);
    };

    const handleCountryChange = (value: WorkspaceCountry) => {
        const defaults = COUNTRY_DEFAULTS[value];
        setCountry(value);
        setTimezone(defaults.timezone);
        setCurrency(defaults.currency);
    };

    const submit = () => {
        redirect(`/dashboard/${slug}`);
    };

    return (
        <>
            <StepIndicator currentStep={step} />
            {step === 0 && (
                <ChurchDetailsStep
                    churchName={churchName}
                    slug={slug}
                    onChurchNameChange={handleChurchNameChange}
                    onSlugChange={handleSlugChange}
                    onSlugBlur={handleSlugBlur}
                />
            )}
            {step === 1 && (
                <WorkspaceStep
                    country={country}
                    timezone={timezone}
                    currency={currency}
                    onCountryChange={handleCountryChange}
                    onTimezoneChange={setTimezone}
                    onCurrencyChange={setCurrency}
                />
            )}
            {step === 2 && <ReadyStep churchName={churchName} slug={slug} country={country} timezone={timezone} currency={currency} />}
            <SetupNav step={step} canContinue={canContinue} onBack={back} onNext={step < lastStepIndex ? next : submit} />
        </>
    );
}
