import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { TOKEN_COOKIE_NAMES, type TokenKind } from './token.constants.js';

export const Token = createParamDecorator((kind: TokenKind, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const cookieName = TOKEN_COOKIE_NAMES[kind];
    const fromCookie = request.cookies?.[cookieName];
    if (typeof fromCookie === 'string' && fromCookie.length > 0) return fromCookie;
    if (kind === 'access' || kind === 'session') {
        const authorization = request.headers.authorization;
        if (authorization?.startsWith('Bearer ')) return authorization.slice(7);
    }
    throw new UnauthorizedException(`${kind} token is required`);
});
