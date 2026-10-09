import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { RequestTokens, TokenKind } from '../../guards/auth/auth.types';
import { TOKEN_REQUEST_KEYS } from './token.constants';

export const Token = createParamDecorator((kind: TokenKind, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request & { tokens?: RequestTokens }>();
    const token = request.tokens?.[TOKEN_REQUEST_KEYS[kind]];
    if (typeof token === 'string' && token.length > 0) return token;
    throw new UnauthorizedException(`${kind} token is required`);
});
