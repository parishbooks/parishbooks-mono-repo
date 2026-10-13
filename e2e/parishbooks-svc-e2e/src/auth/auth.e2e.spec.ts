import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { AuthE2eSupport, E2eEnvironment } from '../support';

describe('Auth API (e2e)', () => {
    describe('POST /auth/sign-up', () => {
        it('creates a new account', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup');
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send(AuthE2eSupport.buildSignUpPayload(email))
                .expect(201);
            expect(response.body).toMatchObject({
                userId: expect.any(String),
                redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
            });
        });

        it('returns 400 when the email is already registered', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup-duplicate');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const duplicate = await AuthE2eSupport.signUpUser(agent, email).expect(400);
            expect(duplicate.body).toMatchObject({
                message: 'An account with this email already exists.',
                code: expect.any(String),
            });
        });
    });

    describe('POST /auth/sign-in', () => {
        it('returns 401 for invalid credentials', async () => {
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email: AuthE2eSupport.uniqueEmail('signin-missing'), password: AuthE2eSupport.testPassword })
                .expect(401);

            expect(response.body).toMatchObject({
                message: 'Invalid email or password.',
                code: expect.any(String),
            });
        });

        it('returns 403 when the email is not verified', async () => {
            const email = AuthE2eSupport.uniqueEmail('signin-unverified');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email, password: AuthE2eSupport.testPassword })
                .expect(403);
            expect(response.body).toMatchObject({
                message: 'Email address is not verified',
                code: expect.any(String),
                redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
            });
        });

        it('sets auth cookies and returns tokens for a verified user', async () => {
            const { signIn, setCookie } = await AuthE2eSupport.createVerifiedSession({ label: 'signin-success', rememberMe: true });
            expect(signIn).toMatchObject({ redirectTo: '/dashboard', accessToken: expect.any(String), refreshToken: expect.any(String) });
            expect(setCookie).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token='), expect.stringContaining('pb_refresh_token=')]));
        });
    });

    describe('POST /auth/email-verification', () => {
        it('send returns success without leaking user existence', async () => {
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/email-verification/send`)
                .send({ email: AuthE2eSupport.uniqueEmail('verify-send-missing') })
                .expect(200);
            expect(response.body).toEqual({ success: true });
        });

        it('verify sets cookies and marks email verified', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-flow');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const databaseUrl = process.env.DATABASE_URL;
            if (!databaseUrl) throw new Error('DATABASE_URL is required');
            const { seedEmailVerificationOtp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);

            const verify = await AuthE2eSupport.verifyEmailOtp(agent, email, AuthE2eSupport.e2eVerificationOtp).expect(200);
            expect(verify.body).toMatchObject({
                redirectTo: '/dashboard',
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            });
            expect(verify.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token=')]));

            await agent.post(`${AuthE2eSupport.authBasePath}/sign-in`).send({ email, password: AuthE2eSupport.testPassword }).expect(200);
        });

        it('returns 400 for an invalid OTP', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-invalid');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const databaseUrl = process.env.DATABASE_URL;
            if (!databaseUrl) throw new Error('DATABASE_URL is required');
            const { seedEmailVerificationOtp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);

            const response = await AuthE2eSupport.verifyEmailOtp(agent, email, '000000').expect(400);
            expect(response.body).toMatchObject({ code: expect.stringMatching(/OTP_/) });
        });
    });

    describe('POST /auth/password-reset', () => {
        it('send returns success without leaking user existence', async () => {
            const response = await AuthE2eSupport.sendPasswordReset(AuthE2eSupport.uniqueEmail('reset-send-missing')).expect(200);
            expect(response.body).toEqual({ success: true });
        });

        it('confirm updates password and allows sign-in', async () => {
            const email = AuthE2eSupport.uniqueEmail('reset-flow');
            const newPassword = 'N3wStr0ng!Pass';
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const databaseUrl = process.env.DATABASE_URL;
            if (!databaseUrl) throw new Error('DATABASE_URL is required');
            const { seedEmailVerificationOtp, seedForgetPasswordOtp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), email, AuthE2eSupport.e2eVerificationOtp).expect(200);

            await seedForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const reset = await AuthE2eSupport.confirmPasswordReset(email, AuthE2eSupport.e2eVerificationOtp, newPassword).expect(200);
            expect(reset.body).toEqual({ success: true, redirectTo: '/sign-in?reset=1' });

            await request(E2eEnvironment.serverUrl).post(`${AuthE2eSupport.authBasePath}/sign-in`).send({ email, password: newPassword }).expect(200);
        });
    });

    describe('POST /auth/refresh', () => {
        it('returns 401 when the refresh cookie is missing', async () => {
            const response = await request(E2eEnvironment.serverUrl).post(`${AuthE2eSupport.authBasePath}/refresh`).expect(401);
            expect(response.body).toMatchObject({
                message: 'Refresh token is invalid or expired.',
                code: expect.any(String),
            });
        });

        it('issues a new access token when the refresh cookie is valid', async () => {
            const { agent } = await AuthE2eSupport.createVerifiedSession({ label: 'refresh-success' });
            const refresh = await agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(200);
            expect(refresh.body).toEqual({ success: true });
            expect(refresh.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token=')]));
        });
    });
});
