import request from 'supertest';
import { describe, it } from 'vitest';
import { AuthE2eSupport, E2eEnvironment, E2eResponseSnapshot } from '../support';

describe('Auth API (e2e)', () => {
    describe('POST /auth/sign-up', () => {
        it('creates a new account', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup');
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-up`)
                .send(AuthE2eSupport.buildSignUpPayload(email))
                .expect(201);

            E2eResponseSnapshot.expectSnapshot(response.body, 'sign-up 201');
        });

        it('returns 400 when the email is already registered', async () => {
            const email = AuthE2eSupport.uniqueEmail('signup-duplicate');
            const agent = AuthE2eSupport.agent();
            await AuthE2eSupport.signUpUser(agent, email).expect(201);
            const duplicate = await AuthE2eSupport.signUpUser(agent, email).expect(400);

            E2eResponseSnapshot.expectSnapshot(duplicate.body, 'sign-up 400 duplicate');
        });
    });

    describe('POST /auth/sign-in', () => {
        it('returns 401 for invalid credentials', async () => {
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email: AuthE2eSupport.uniqueEmail('signin-missing'), password: AuthE2eSupport.testPassword })
                .expect(401);

            E2eResponseSnapshot.expectSnapshot(response.body, 'sign-in 401');
        });

        it('returns 403 when the email is not verified', async () => {
            const email = AuthE2eSupport.uniqueEmail('signin-unverified');
            await AuthE2eSupport.signUpUser(AuthE2eSupport.agent(), email).expect(201);
            const response = await request(E2eEnvironment.serverUrl)
                .post(`${AuthE2eSupport.authBasePath}/sign-in`)
                .send({ email, password: AuthE2eSupport.testPassword })
                .expect(403);

            E2eResponseSnapshot.expectSnapshot(response.body, 'sign-in 403 unverified');
        });

        it('sets auth cookies and returns tokens for a verified user', async () => {
            const { signIn, setCookie } = await AuthE2eSupport.createVerifiedSession({ label: 'signin-success', rememberMe: true });

            E2eResponseSnapshot.expectSnapshot(signIn, 'sign-in 200 verified');
            E2eResponseSnapshot.expectSetCookies(setCookie, 'sign-in 200 set-cookie');
        });
    });

    describe('POST /auth/refresh', () => {
        it('returns 401 when the refresh cookie is missing', async () => {
            const response = await request(E2eEnvironment.serverUrl).post(`${AuthE2eSupport.authBasePath}/refresh`).expect(401);

            E2eResponseSnapshot.expectSnapshot(response.body, 'refresh 401');
        });

        it('issues a new access token when the refresh cookie is valid', async () => {
            const { agent } = await AuthE2eSupport.createVerifiedSession({ label: 'refresh-success' });
            const refresh = await agent.post(`${AuthE2eSupport.authBasePath}/refresh`).expect(200);

            E2eResponseSnapshot.expectSnapshot(refresh.body, 'refresh 200');
            E2eResponseSnapshot.expectSetCookies(refresh.headers['set-cookie'], 'refresh 200 set-cookie');
        });
    });
});
