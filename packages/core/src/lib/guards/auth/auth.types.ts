export type AuthGuardOptions = {
    jwksUrl: string;
    issuer?: string;
    audience?: string;
};

export type TokenKind = 'access' | 'refresh' | 'session';

export type RequestTokens = {
    accessToken?: string;
    refreshToken?: string;
    sessionToken?: string;
};

export type AuthSession = {
    sessionId: string;
    sessionToken: string;
    userId: string;
    email: string;
    name: string;
    emailVerified: boolean;
    organizationId?: string | null;
    sub?: string;
    iss?: string;
    aud?: string | string[];
    exp?: number;
    iat?: number;
};
