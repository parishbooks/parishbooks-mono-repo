import request from 'supertest';
import { E2eEnvironment } from './e2e-environment';
import { seedEmailVerificationOtpAfterSignUp } from './otp-e2e.helper';

export type TestAgent = ReturnType<typeof request.agent>;

export type SignUpPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type VerifiedSession = {
    agent: TestAgent;
    email: string;
    password: string;
    userId: string;
    signIn: {
        redirectTo: string;
        accessToken: string;
        refreshToken: string;
    };
    setCookie: string[] | undefined;
};

export type CreateVerifiedSessionOptions = {
    /** Prefix for the generated email (default: `session`) */
    label?: string;
    rememberMe?: boolean;
    /** Reuse an existing agent (e.g. to preserve cookies across calls) */
    agent?: TestAgent;
};

export class AuthE2eSupport {
    static readonly authBasePath = '/api/v1/auth';
    static readonly testPassword = 'Str0ng!Pass1';
    static readonly e2eVerificationOtp = '123456';

    static uniqueEmail(label: string): string {
        const token = crypto.randomUUID().slice(0, 8);
        return `${label}-${token}@e2e.parishbooks.test`;
    }

    static buildSignUpPayload(email: string): SignUpPayload {
        return { email, password: this.testPassword, firstName: 'E2E', lastName: 'User' };
    }

    static signUpUser(agent: TestAgent, email: string) {
        return agent.post(`${this.authBasePath}/sign-up`).send(this.buildSignUpPayload(email));
    }

    static agent(serverUrl = E2eEnvironment.serverUrl): TestAgent {
        return request.agent(serverUrl);
    }

    static verifyEmailOtp(agent: TestAgent, email: string, otp: string, rememberMe?: boolean) {
        return agent.post(`${this.authBasePath}/email-verification/verify`).send({ email, otp, rememberMe });
    }

    static sendPasswordReset(email: string) {
        return request(E2eEnvironment.serverUrl).post(`${this.authBasePath}/password-reset/send`).send({ email });
    }

    static confirmPasswordReset(email: string, otp: string, password: string) {
        return request(E2eEnvironment.serverUrl).post(`${this.authBasePath}/password-reset/confirm`).send({ email, otp, password });
    }

    /** Sign-up → seed OTP → verify (sets auth cookies). */
    static async createVerifiedSession(options: CreateVerifiedSessionOptions = {}): Promise<VerifiedSession> {
        const email = this.uniqueEmail(options.label ?? 'session');
        const agent = options.agent ?? this.agent();
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) throw new Error('DATABASE_URL is required for auth e2e tests');

        const signUp = await this.signUpUser(agent, email).expect(201);
        await seedEmailVerificationOtpAfterSignUp(email, this.e2eVerificationOtp, databaseUrl);

        const verify = await this.verifyEmailOtp(agent, email, this.e2eVerificationOtp, options.rememberMe).expect(200);

        return {
            agent,
            email,
            password: this.testPassword,
            userId: signUp.body.userId,
            signIn: verify.body,
            setCookie: this.normalizeSetCookie(verify.headers['set-cookie']),
        };
    }

    private static normalizeSetCookie(header: string | string[] | undefined): string[] | undefined {
        if (header === undefined) return undefined;
        return Array.isArray(header) ? header : [header];
    }
}
