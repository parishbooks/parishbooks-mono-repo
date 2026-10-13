import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { AuthE2eSupport, E2eEnvironment } from '../support';
import { requireDatabaseUrl, setUserStatus, softDeleteUser } from '../support/auth-db.helper';

describe('Auth API (e2e)', () => {
    describe('POST /auth/sign-up', () => {
        it('creates a new account', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup');
            const databaseUrl = requireDatabaseUrl();
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send(AuthE2eSupport.buildSignUpPayload(email))
                .expect(201);
            expect(response.body).toMatchObject({
                userId: expect.any(String),
                redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
            });

            const { loadSignUpDbState } = await import('../support/signup-db.helper');
            const db = await loadSignUpDbState(response.body.userId, databaseUrl);
            expect(db.user).toEqual({ email, status: 'pending' });
            expect(db.profile).toMatchObject({ userId: response.body.userId, fullName: 'E2E User', phone: null, hasPassword: true });
            expect(db.client).toEqual({ userId: response.body.userId });
            expect(db.memberCount).toBe(0);
            expect(db.organizationCountForUser).toBe(0);
        });

        it('stores optional phone on profile', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup-phone');
            const phone = '+15551234567';
            const response = await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email, { phone }).expect(201);
            const { loadSignUpDbState } = await import('../support/signup-db.helper');
            const db = await loadSignUpDbState(response.body.userId, requireDatabaseUrl());
            expect(db.profile.phone).toBe(phone);
        });

        it('returns 400 for invalid email, weak password, or missing required fields', async () => {
            const agent = AuthE2eSupport.agent();
            await agent
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send(AuthE2eSupport.buildSignUpPayload(AuthE2eSupport.uniqueEmail('signup-bad-email'), { email: 'not-an-email' }))
                .expect(400);
            await agent
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send({ ...AuthE2eSupport.buildSignUpPayload(AuthE2eSupport.uniqueEmail('signup-weak')), password: 'weak' })
                .expect(400);
            await agent
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send({ email: AuthE2eSupport.uniqueEmail('signup-missing-name'), password: AuthE2eSupport.testPassword, lastName: 'User' })
                .expect(400);
        });

        it('normalizes email and allows sign-in with mixed case after verify', async () => {
            const mixedCaseEmail = `Signup-Norm-${crypto.randomUUID().slice(0, 8)}@E2E.Parishbooks.Test`;
            const normalizedEmail = mixedCaseEmail.trim().toLowerCase();
            const agent = AuthE2eSupport.agent();
            const databaseUrl = requireDatabaseUrl();

            const signUp = await agent.post(`${AuthE2eSupport.authBasePath}/sign-up`).send(AuthE2eSupport.buildSignUpPayload(mixedCaseEmail)).expect(201);
            expect(signUp.body.redirectTo).toBe(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);

            const { loadSignUpDbState } = await import('../support/signup-db.helper');
            const db = await loadSignUpDbState(signUp.body.userId, databaseUrl);
            expect(db.user.email).toBe(normalizedEmail);

            const { seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(mixedCaseEmail, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.verifyEmailOtp(agent, mixedCaseEmail, AuthE2eSupport.e2eVerificationOtp).expect(200);

            await agent.post(`${AuthE2eSupport.authBasePath}/sign-in`).send({ email: mixedCaseEmail, password: AuthE2eSupport.testPassword }).expect(200);
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

        it('returns 400 when re-registering a soft-deleted account', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup-soft-deleted');
            const signUp = await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            await softDeleteUser(signUp.body.userId, requireDatabaseUrl());
            const duplicate = await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(400);
            expect(duplicate.body).toMatchObject({ message: expect.stringContaining('already exists') });
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

        it('returns 401 for malformed email (local auth runs before DTO validation)', async () => {
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email: 'not-an-email', password: AuthE2eSupport.testPassword })
                .expect(401);
            expect(response.body).toMatchObject({ message: 'Invalid email or password.' });
        });

        it('returns 401 for wrong password on a verified account', async () => {
            const { email } = await AuthE2eSupport.createVerifiedSession({ label: 'signin-wrong-pass' });
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email, password: 'WrongPass1!' })
                .expect(401);
            expect(response.body).toMatchObject({ message: 'Invalid email or password.' });
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

        it('returns 403 when the account is suspended', async () => {
            const session = await AuthE2eSupport.createVerifiedSession({ label: 'signin-banned' });
            await setUserStatus(session.userId, 'suspended', requireDatabaseUrl());
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email: session.email, password: session.password })
                .expect(403);
            expect(response.body).toMatchObject({ code: 'USER_BANNED' });
        });

        it('sets auth cookies and returns tokens for a verified user', async () => {
            const { signIn, setCookie } = await AuthE2eSupport.createVerifiedSession({ label: 'signin-success', rememberMe: true });
            expect(signIn).toMatchObject({ redirectTo: '/dashboard', accessToken: expect.any(String), refreshToken: expect.any(String) });
            expect(setCookie).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token='), expect.stringContaining('pb_refresh_token=')]));
        });
    });

    describe('POST /auth/email-verification', () => {
        it('send returns success without leaking user existence', async () => {
            const response = await AuthE2eSupport.sendEmailVerification(AuthE2eSupport.uniqueEmail('verify-send-missing')).expect(200);
            expect(response.body).toEqual({ success: true });
        });

        it('send succeeds for a pending user when outside OTP send cooldown', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-resend');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { patchEmailVerificationOtpTimestamps, seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await patchEmailVerificationOtpTimestamps(email, databaseUrl, { updatedAt: new Date(Date.now() - 61_000) });
            await AuthE2eSupport.sendEmailVerification(email).expect(200);
        });

        it('send returns 429 when OTP was sent within the cooldown window', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-send-cooldown');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { patchEmailVerificationOtpTimestamps, seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await patchEmailVerificationOtpTimestamps(email, databaseUrl, { updatedAt: new Date() });
            const response = await AuthE2eSupport.sendEmailVerification(email).expect(429);
            expect(response.body).toMatchObject({ code: 'OTP_RATE_LIMITED' });
        });

        it('verify sets cookies and marks email verified', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-flow');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);

            const verify = await AuthE2eSupport.verifyEmailOtp(agent, email, AuthE2eSupport.e2eVerificationOtp).expect(200);
            expect(verify.body).toMatchObject({
                redirectTo: '/dashboard',
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            });
            expect(verify.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token=')]));

            await agent.post(`${AuthE2eSupport.authBasePath}/sign-in`).send({ email, password: AuthE2eSupport.testPassword }).expect(200);
        });

        it('returns 404 when verifying OTP for an unknown email', async () => {
            const response = await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), AuthE2eSupport.uniqueEmail('verify-no-user'), '123456').expect(404);
            expect(response.body).toMatchObject({ code: 'USER_NOT_FOUND' });
        });

        it('returns 403 when verifying OTP for a suspended account', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-banned');
            const signUp = await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            await setUserStatus(signUp.body.userId, 'suspended', requireDatabaseUrl());
            const databaseUrl = requireDatabaseUrl();
            const { seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const response = await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), email, AuthE2eSupport.e2eVerificationOtp).expect(403);
            expect(response.body).toMatchObject({ code: 'USER_BANNED' });
        });

        it('returns 400 for an invalid OTP', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-invalid');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);

            const response = await AuthE2eSupport.verifyEmailOtp(agent, email, '000000').expect(400);
            expect(response.body).toMatchObject({ code: 'OTP_INVALID' });
        });

        it('returns 400 for an expired OTP', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-expired');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { patchEmailVerificationOtpTimestamps, seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await patchEmailVerificationOtpTimestamps(email, databaseUrl, { expiresAt: new Date(Date.now() - 60_000) });
            const response = await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), email, AuthE2eSupport.e2eVerificationOtp).expect(400);
            expect(response.body).toMatchObject({ code: 'OTP_EXPIRED' });
        });

        it('returns 429 after too many failed OTP attempts', async () => {
            const email = AuthE2eSupport.uniqueEmail('verify-rate-limit');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { patchEmailVerificationOtpAttempts, seedEmailVerificationOtpAfterSignUp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await patchEmailVerificationOtpAttempts(email, AuthE2eSupport.e2eVerificationOtp, 2, databaseUrl);
            const rateLimited = await AuthE2eSupport.verifyEmailOtp(agent, email, '000000').expect(429);
            expect(rateLimited.body).toMatchObject({ code: 'OTP_RATE_LIMITED' });
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
            const databaseUrl = requireDatabaseUrl();
            const { seedEmailVerificationOtpAfterSignUp, seedForgetPasswordOtp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), email, AuthE2eSupport.e2eVerificationOtp).expect(200);

            await seedForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const reset = await AuthE2eSupport.confirmPasswordReset(email, AuthE2eSupport.e2eVerificationOtp, newPassword).expect(200);
            expect(reset.body).toEqual({ success: true, redirectTo: '/sign-in?reset=1' });

            await request(E2eEnvironment.serverUrl).post(`${AuthE2eSupport.authBasePath}/sign-in`).send({ email, password: newPassword }).expect(200);
        });

        it('returns 404 when confirming reset for an unknown email', async () => {
            const email = AuthE2eSupport.uniqueEmail('reset-no-user');
            const databaseUrl = requireDatabaseUrl();
            const { seedForgetPasswordOtp } = await import('../support/otp-e2e.helper');
            await seedForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const response = await AuthE2eSupport.confirmPasswordReset(email, AuthE2eSupport.e2eVerificationOtp, 'N3wStr0ng!Pass').expect(404);
            expect(response.body).toMatchObject({ code: 'USER_NOT_FOUND' });
        });

        it('returns 400 for invalid OTP, expired OTP, or weak new password', async () => {
            const email = AuthE2eSupport.uniqueEmail('reset-failures');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const databaseUrl = requireDatabaseUrl();
            const { seedEmailVerificationOtpAfterSignUp, seedForgetPasswordOtp, seedExpiredForgetPasswordOtp } = await import('../support/otp-e2e.helper');
            await seedEmailVerificationOtpAfterSignUp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.verifyEmailOtp(AuthE2eSupport.agent(), email, AuthE2eSupport.e2eVerificationOtp).expect(200);

            await seedForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.confirmPasswordReset(email, '000000', 'N3wStr0ng!Pass').expect(400);

            await seedExpiredForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const expired = await AuthE2eSupport.confirmPasswordReset(email, AuthE2eSupport.e2eVerificationOtp, 'N3wStr0ng!Pass').expect(400);
            expect(expired.body).toMatchObject({ code: 'OTP_EXPIRED' });

            await seedForgetPasswordOtp(email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            await AuthE2eSupport.confirmPasswordReset(email, AuthE2eSupport.e2eVerificationOtp, 'weak').expect(400);
        });

        it('returns 403 when confirming reset for a suspended account', async () => {
            const session = await AuthE2eSupport.createVerifiedSession({ label: 'reset-banned' });
            await setUserStatus(session.userId, 'suspended', requireDatabaseUrl());
            const databaseUrl = requireDatabaseUrl();
            const { seedForgetPasswordOtp } = await import('../support/otp-e2e.helper');
            await seedForgetPasswordOtp(session.email, AuthE2eSupport.e2eVerificationOtp, databaseUrl);
            const response = await AuthE2eSupport.confirmPasswordReset(session.email, AuthE2eSupport.e2eVerificationOtp, 'N3wStr0ng!Pass').expect(403);
            expect(response.body).toMatchObject({ code: 'USER_BANNED' });
        });

        it('returns 429 when password-reset send is throttled after three requests per minute', async () => {
            await AuthE2eSupport.sendPasswordReset(AuthE2eSupport.uniqueEmail('reset-throttle-0')).expect(200);
            await AuthE2eSupport.sendPasswordReset(AuthE2eSupport.uniqueEmail('reset-throttle-1')).expect(200);
            const throttled = await AuthE2eSupport.sendPasswordReset(AuthE2eSupport.uniqueEmail('reset-throttle-blocked')).expect(429);
            expect(throttled.body).toMatchObject({ message: expect.any(String) });
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

        it('returns 401 when the refresh cookie is invalid', async () => {
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/refresh`)
                .set('Cookie', 'pb_refresh_token=not-a-valid-jwt')
                .expect(401);
            expect(response.body).toMatchObject({ code: 'REFRESH_INVALID' });
        });

        it('issues a new access token when the refresh cookie is valid', async () => {
            const { agent } = await AuthE2eSupport.createVerifiedSession({ label: 'refresh-success' });
            const refresh = await agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(200);
            expect(refresh.body).toEqual({ success: true });
            expect(refresh.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token=')]));
        });

        it('allows consecutive refresh calls while the session remains valid', async () => {
            const { agent } = await AuthE2eSupport.createVerifiedSession({ label: 'refresh-consecutive' });
            await agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(200);
            const second = await agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(200);
            expect(second.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('pb_access_token=')]));
        });

        it('returns 403 when the account is suspended', async () => {
            const session = await AuthE2eSupport.createVerifiedSession({ label: 'refresh-banned' });
            await setUserStatus(session.userId, 'suspended', requireDatabaseUrl());
            const response = await session.agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(403);
            expect(response.body).toMatchObject({ code: 'USER_BANNED' });
        });
    });
});
