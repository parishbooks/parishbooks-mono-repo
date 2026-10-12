import pg from 'pg';
import request from 'supertest';
import { E2eEnvironment } from './e2e-environment';

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
    tenantId: string;
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

    /** Sign-up → verify email → sign-in; returns a cookie-authenticated Supertest agent. */
    static async createVerifiedSession(options: CreateVerifiedSessionOptions = {}): Promise<VerifiedSession> {
        const email = this.uniqueEmail(options.label ?? 'session');
        const agent = options.agent ?? this.agent();

        const signUp = await this.signUpUser(agent, email).expect(201);
        await this.markEmailVerified(email);

        const signIn = await agent
            .post(`${this.authBasePath}/sign-in`)
            .send({ email, password: this.testPassword, rememberMe: options.rememberMe })
            .expect(200);

        return {
            agent,
            email,
            password: this.testPassword,
            tenantId: signUp.body.tenantId,
            userId: signUp.body.userId,
            signIn: signIn.body,
            setCookie: this.normalizeSetCookie(signIn.headers['set-cookie']),
        };
    }

    private static normalizeSetCookie(header: string | string[] | undefined): string[] | undefined {
        if (header === undefined) return undefined;
        return Array.isArray(header) ? header : [header];
    }

    private static async markEmailVerified(email: string) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) throw new Error('DATABASE_URL is required for auth e2e tests');

        const client = new pg.Client({ connectionString: databaseUrl });
        await client.connect();
        try {
            await client.query('UPDATE "user" SET email_verified = true WHERE email = $1', [email]);
        } finally {
            await client.end();
        }
    }
}
