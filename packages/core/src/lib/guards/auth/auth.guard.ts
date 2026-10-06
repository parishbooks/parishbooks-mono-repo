import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_TOKEN_COOKIE } from '../../decorators/token/token.constants.js';
import { AUTH_GUARD_OPTIONS, IS_PUBLIC_KEY } from './auth.constants.js';
import type { AuthGuardOptions, AuthSession, RequestTokens } from './auth.types.js';

type AuthenticatedRequest = Request & {
    tokens?: RequestTokens;
    authSession?: AuthSession;
};

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

    constructor(
        private readonly reflector: Reflector,
        @Inject(AUTH_GUARD_OPTIONS) private readonly options: AuthGuardOptions,
    ) {
        this.jwks = createRemoteJWKSet(new URL(options.jwksUrl));
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const tokens = this.extractTokens(request);
        if (!tokens.accessToken) throw new UnauthorizedException('access token is required');
        const session = await this.verifyAccessToken(tokens.accessToken);
        if (!tokens.sessionToken && session.sessionToken) tokens.sessionToken = session.sessionToken;
        request.tokens = tokens;
        request.authSession = session;
        this.stripTokens(request);
        return true;
    }

    private extractTokens(request: AuthenticatedRequest): RequestTokens {
        const cookies = request.cookies ?? {};
        const authorization = request.headers.authorization;
        const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
        return {
            accessToken: typeof cookies[ACCESS_TOKEN_COOKIE] === 'string' && cookies[ACCESS_TOKEN_COOKIE] ? cookies[ACCESS_TOKEN_COOKIE] : bearer,
            refreshToken: typeof cookies[REFRESH_TOKEN_COOKIE] === 'string' ? cookies[REFRESH_TOKEN_COOKIE] : undefined,
            sessionToken: typeof cookies[SESSION_TOKEN_COOKIE] === 'string' ? cookies[SESSION_TOKEN_COOKIE] : undefined,
        };
    }

    private async verifyAccessToken(accessToken: string): Promise<AuthSession> {
        try {
            const { payload } = await jwtVerify(accessToken, this.jwks, { issuer: this.options.issuer, audience: this.options.audience });
            return this.toAuthSession(payload);
        } catch {
            throw new UnauthorizedException('invalid access token');
        }
    }

    private toAuthSession(payload: JWTPayload): AuthSession {
        const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : undefined;
        const sessionToken = typeof payload.sessionToken === 'string' ? payload.sessionToken : undefined;
        const userId = typeof payload.userId === 'string' ? payload.userId : typeof payload.sub === 'string' ? payload.sub : undefined;
        const email = typeof payload.email === 'string' ? payload.email : undefined;
        const name = typeof payload.name === 'string' ? payload.name : undefined;
        if (!sessionId || !sessionToken || !userId || !email || !name) throw new UnauthorizedException('invalid access token payload');
        return {
            sessionId,
            sessionToken,
            userId,
            email,
            name,
            emailVerified: Boolean(payload.emailVerified),
            organizationId: typeof payload.organizationId === 'string' ? payload.organizationId : payload.organizationId === null ? null : undefined,
            sub: typeof payload.sub === 'string' ? payload.sub : undefined,
            iss: typeof payload.iss === 'string' ? payload.iss : undefined,
            aud: payload.aud,
            exp: payload.exp,
            iat: payload.iat,
        };
    }

    private stripTokens(request: AuthenticatedRequest): void {
        if (request.cookies) {
            delete request.cookies[ACCESS_TOKEN_COOKIE];
            delete request.cookies[REFRESH_TOKEN_COOKIE];
            delete request.cookies[SESSION_TOKEN_COOKIE];
        }
        delete request.headers.authorization;
        const cookieHeader = request.headers.cookie;
        if (typeof cookieHeader !== 'string' || !cookieHeader) return;
        const retained = cookieHeader
            .split(';')
            .map((part) => part.trim())
            .filter((part) => {
                const name = part.split('=')[0]?.trim();
                return name !== ACCESS_TOKEN_COOKIE && name !== REFRESH_TOKEN_COOKIE && name !== SESSION_TOKEN_COOKIE;
            });
        if (retained.length === 0) delete request.headers.cookie;
        else request.headers.cookie = retained.join('; ');
    }
}
