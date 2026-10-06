import { createRemoteJWKSet, jwtVerify } from 'jose';

const svcBaseUrl = (
    process.env.NEXT_PUBLIC_APP_SVC_URL ??
    process.env.APP_SVC_URL ??
    process.env.IAM_BASE_URL ??
    `http://localhost:${process.env.APP_SVC_PORT ?? '8000'}`
).replace(/\/$/, '');

/** Matches Better Auth `AUTH_BASE_PATH` + JWKS route used by the svc AuthGuard. */
const jwks = createRemoteJWKSet(new URL(`${svcBaseUrl}/iam/jwks`));

export async function isAccessTokenValid(accessToken: string): Promise<boolean> {
    try {
        await jwtVerify(accessToken, jwks, { issuer: svcBaseUrl, audience: svcBaseUrl });
        return true;
    } catch {
        return false;
    }
}

export { svcBaseUrl };
