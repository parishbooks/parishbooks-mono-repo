'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail, MessageSquare, Sparkles, Users, Zap } from 'lucide-react';
import { Button } from '@parishbooks/design-system/ui/button';
import { Input } from '@parishbooks/design-system/ui/input';
import { Label } from '@parishbooks/design-system/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@parishbooks/design-system/ui/input-otp';

const screens = [
    { id: 'signin', label: 'Sign in' },
    { id: 'signup', label: 'Create account' },
    { id: 'verify-email', label: 'Verify email' },
    { id: 'send-otp', label: 'Send OTP' },
    { id: 'forgot', label: 'Forgot password' },
    { id: 'reset', label: 'Reset password' },
    { id: 'verify-phone', label: 'Verify phone' },
] as const;

type ScreenId = (typeof screens)[number]['id'];

export function AuthFlow() {
    const [screen, setScreen] = useState<ScreenId>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('alex@studio.co');
    const go = (id: ScreenId) => {
        setSubmitted(false);
        setScreen(id);
    };
    const submit = (next?: ScreenId) => {
        setSubmitted(true);
        if (next) window.setTimeout(() => go(next), 700);
    };

    return (
        <main className="min-h-svh bg-muted/30 p-4 text-foreground sm:p-6 lg:p-8">
            <div className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-7xl flex-col overflow-hidden rounded-3xl border border-border/70 bg-background shadow-2xl shadow-primary/5">
                <header className="flex items-center justify-between border-b border-border/60 px-6 py-5 sm:px-10">
                    <button onClick={() => go('signin')} className="flex items-center gap-2 text-base font-semibold tracking-tight" aria-label="Go to sign in">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <Sparkles className="size-4" />
                        </span>
                        base.maia
                    </button>
                    <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
                        <span className="size-2 rounded-full bg-emerald-500" /> Trusted by modern teams
                    </div>
                </header>
                <div className="grid flex-1 lg:grid-cols-[0.9fr_1.1fr]">
                    <aside className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
                        <div className="absolute -right-24 -top-24 size-80 rounded-full border border-primary-foreground/10 bg-primary-foreground/5" />
                        <div className="absolute -bottom-32 -left-20 size-96 rounded-full border border-primary-foreground/10 bg-primary-foreground/5" />
                        <div className="relative">
                            <p className="mb-6 text-sm font-medium text-primary-foreground/70">The operating system for your business</p>
                            <h2 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.05em] xl:text-5xl">Move work forward, together.</h2>
                            <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/70">
                                Bring your team, projects, and customer relationships into one beautifully simple workspace.
                            </p>
                        </div>
                        <div className="relative flex flex-col gap-4">
                            <Testimonial />
                            <div className="flex gap-6 border-t border-primary-foreground/15 pt-5 text-sm text-primary-foreground/70">
                                <span className="flex items-center gap-2">
                                    <Users className="size-4" /> 12k+ teams
                                </span>
                                <span className="flex items-center gap-2">
                                    <Zap className="size-4" /> 99.9% uptime
                                </span>
                            </div>
                        </div>
                    </aside>
                    <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
                        <div className="w-full max-w-[480px]">
                            {screen === 'signin' && (
                                <SignIn
                                    email={email}
                                    setEmail={setEmail}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    submitted={submitted}
                                    submit={() => submit()}
                                    go={go}
                                />
                            )}
                            {screen === 'signup' && (
                                <SignUp
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    submitted={submitted}
                                    submit={() => submit('verify-email')}
                                    go={go}
                                />
                            )}
                            {screen === 'verify-email' && <VerifyEmail email={email} submitted={submitted} submit={() => submit('send-otp')} go={go} />}
                            {screen === 'send-otp' && <SendOtp submitted={submitted} submit={() => submit('verify-phone')} go={go} />}
                            {screen === 'forgot' && <Forgot email={email} setEmail={setEmail} submitted={submitted} submit={() => submit('reset')} go={go} />}
                            {screen === 'reset' && <Reset submitted={submitted} submit={() => submit('signin')} go={go} />}
                            {screen === 'verify-phone' && <VerifyPhone submitted={submitted} submit={() => submit('signin')} go={go} />}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

function Testimonial() {
    return (
        <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5">
            <div className="mb-4 flex gap-1 text-primary-foreground/80">★★★★★</div>
            <p className="text-sm leading-6 text-primary-foreground/85">
                “base.maia gives our team clarity without adding more noise. It became our daily home base in a week.”
            </p>
            <div className="mt-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-semibold">JM</div>
                <div>
                    <p className="text-sm font-medium">Jordan Miller</p>
                    <p className="text-xs text-primary-foreground/60">COO, Northstar</p>
                </div>
            </div>
        </div>
    );
}
function Shell({
    eyebrow,
    title,
    description,
    children,
    footer,
}: {
    eyebrow: string;
    title: string;
    description: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-9">
                <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
    );
}
function FormField({ label, id, type = 'text', value, onChange, placeholder, right }: any) {
    return (
        <div className="flex flex-col gap-2.5">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`h-14 rounded-xl px-4 text-base ${right ? 'pr-12' : ''}`}
                />
                {right}
            </div>
        </div>
    );
}
function Submit({ children, submitted, onClick }: any) {
    return (
        <Button type="button" className="h-14 w-full rounded-xl text-base font-semibold" onClick={onClick} isLoading={submitted}>
            {children}
            {submitted ? null : <ArrowRight data-icon="inline-end" />}
        </Button>
    );
}
function GoogleButton() {
    return (
        <Button type="button" variant="outline" className="h-14 w-full rounded-xl text-base font-medium">
            <span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4] shadow-sm">
                G
            </span>{' '}
            Continue with Google
        </Button>
    );
}
function Divider() {
    return (
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            OR
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}
function Back({ onClick }: { onClick: () => void }) {
    return (
        <Button type="button" variant="ghost" size="sm" onClick={onClick} className="h-10 px-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft data-icon="inline-start" /> Back
        </Button>
    );
}
function PasswordToggle({ show, setShow }: any) {
    return (
        <button type="button" aria-label="Toggle password visibility" onClick={() => setShow(!show)} className="absolute right-4 top-4 text-muted-foreground">
            {show ? <EyeOff /> : <Eye />}
        </button>
    );
}
function SignIn({ email, setEmail, showPassword, setShowPassword, submitted, submit, go }: any) {
    return (
        <Shell eyebrow="Welcome back" title="Sign in to continue" description="Enter your details to access your workspace.">
            <GoogleButton />
            <Divider />
            <div className="flex flex-col gap-5">
                <FormField label="Email address" id="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" />
                <FormField
                    label="Password"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    right={<PasswordToggle show={showPassword} setShow={setShowPassword} />}
                />
                <div className="-mt-2 flex justify-end">
                    <button onClick={() => go('forgot')} className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </button>
                </div>
                <Submit submitted={submitted} onClick={submit}>
                    Sign in
                </Submit>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                New to base.maia?{' '}
                <button onClick={() => go('signup')} className="font-semibold text-primary hover:underline">
                    Create an account
                </button>
            </div>
        </Shell>
    );
}
function SignUp({ showPassword, setShowPassword, submitted, submit, go }: any) {
    return (
        <Shell eyebrow="Get started" title="Create your account" description="Join thousands of teams building better ways to work.">
            <GoogleButton />
            <Divider />
            <div className="flex flex-col gap-4">
                <FormField label="Full name" id="name" placeholder="Alex Morgan" />
                <FormField label="Email address" id="signup-email" placeholder="you@example.com" />
                <FormField
                    label="Password"
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    right={<PasswordToggle show={showPassword} setShow={setShowPassword} />}
                />
                <p className="text-xs leading-5 text-muted-foreground">By creating an account, you agree to our Terms and Privacy Policy.</p>
                <Submit submitted={submitted} onClick={submit}>
                    Create account
                </Submit>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => go('signin')} className="font-semibold text-primary hover:underline">
                    Sign in
                </button>
            </div>
        </Shell>
    );
}
function VerifyEmail({ email, submitted, submit, go }: any) {
    return (
        <Shell
            eyebrow="Almost there"
            title="Check your inbox"
            description={
                <>
                    We sent a verification link to <strong className="font-medium text-foreground">{email}</strong>. Click it to verify your email.
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-center py-5">
                    <span className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Mail className="size-8" />
                    </span>
                </div>
                <Submit submitted={submitted} onClick={submit}>
                    I’ve verified my email
                </Submit>
                <Button variant="outline" className="h-14 rounded-xl text-base" onClick={() => undefined}>
                    Resend email
                </Button>
                <Back onClick={() => go('signup')} />
            </div>
        </Shell>
    );
}
function SendOtp({ submit, go }: any) {
    return (
        <Shell eyebrow="Two-step verification" title="Send a one-time code" description="Choose where you’d like to receive your verification code.">
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="h-20 justify-start gap-4 rounded-xl px-5 text-left" onClick={submit}>
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageSquare />
                    </span>
                    <span className="flex-1">
                        <span className="block text-base font-medium">Text message</span>
                        <span className="text-sm text-muted-foreground">•••••• 4821</span>
                    </span>
                    <ArrowRight />
                </Button>
                <Button variant="outline" className="h-20 justify-start gap-4 rounded-xl px-5 text-left" onClick={submit}>
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail />
                    </span>
                    <span className="flex-1">
                        <span className="block text-base font-medium">Email me a code</span>
                        <span className="text-sm text-muted-foreground">a•••@studio.co</span>
                    </span>
                    <ArrowRight />
                </Button>
                <Back onClick={() => go('verify-email')} />
            </div>
        </Shell>
    );
}
function Forgot({ email, setEmail, submitted, submit, go }: any) {
    return (
        <Shell eyebrow="Account recovery" title="Forgot your password?" description="No worries. Enter your email and we’ll send you a link to reset it.">
            <div className="flex flex-col gap-5">
                <FormField
                    label="Email address"
                    id="forgot-email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
                <Submit submitted={submitted} onClick={submit}>
                    Send reset link
                </Submit>
                <Back onClick={() => go('signin')} />
            </div>
        </Shell>
    );
}
function Reset({ submitted, submit, go }: any) {
    return (
        <Shell eyebrow="Set a new password" title="Reset your password" description="Choose a strong password you haven’t used before.">
            <div className="flex flex-col gap-4">
                <FormField label="New password" id="new-password" type="password" placeholder="At least 8 characters" />
                <FormField label="Confirm password" id="confirm-password" type="password" placeholder="Repeat your password" />
                <Submit submitted={submitted} onClick={submit}>
                    Update password
                </Submit>
                <Back onClick={() => go('forgot')} />
            </div>
        </Shell>
    );
}
function VerifyPhone({ submitted, submit, go }: any) {
    return (
        <Shell eyebrow="Enter verification code" title="Verify your phone" description="We sent a 6-digit code to +1 (•••) •••-4821.">
            <div className="flex flex-col items-center gap-6">
                <InputOTP maxLength={6} aria-label="Phone verification code">
                    <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <p className="text-center text-sm text-muted-foreground">
                    Didn’t get a code? <button className="font-semibold text-primary hover:underline">Resend in 00:42</button>
                </p>
                <Submit submitted={submitted} onClick={submit}>
                    Verify phone
                </Submit>
                <Back onClick={() => go('send-otp')} />
            </div>
        </Shell>
    );
}

export { screens };
