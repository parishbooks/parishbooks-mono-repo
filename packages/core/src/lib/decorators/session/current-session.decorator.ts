import { createParamDecorator, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthSession } from '../../guards/auth/auth.types';

export const CurrentSession = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthSession => {
    const request = ctx.switchToHttp().getRequest<Request & { authSession?: AuthSession }>();
    if (!request.authSession) throw new UnauthorizedException('session is required');
    return request.authSession;
});
