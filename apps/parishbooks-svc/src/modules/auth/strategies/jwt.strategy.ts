import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_TOKEN_TYPE_ACCESS } from '../constants/jwt.constant';
import { PB_ACCESS_TOKEN_COOKIE } from '../constants/cookie.constant';
import { JwtPayload } from '../interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => request.cookies?.[PB_ACCESS_TOKEN_COOKIE] ?? null,
            ]),
            secretOrKey: configService.getOrThrow('auth.jwt.secret'),
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            algorithms: ['HS384'],
        });
    }

    override async validate(payload: JwtPayload & { typ?: string }): Promise<JwtPayload> {
        if (payload.typ && payload.typ !== JWT_TOKEN_TYPE_ACCESS) throw new UnauthorizedException();
        return {
            sub: payload.sub,
            iss: payload.iss,
            aud: payload.aud,
            iat: payload.iat,
            exp: payload.exp,
        };
    }
}
