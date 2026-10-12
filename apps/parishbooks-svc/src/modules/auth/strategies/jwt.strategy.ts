import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_TOKEN_TYPE_ACCESS } from '../constants/jwt.constant';
import { PB_ACCESS_TOKEN_COOKIE } from '../constants/cookie.constant';
import { JwtPayload } from '../interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('auth.jwt.secret'),
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            algorithms: ['HS384'],
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => request.cookies?.[PB_ACCESS_TOKEN_COOKIE] ?? null,
            ]),
        });
    }

    override async validate(payload: JwtPayload): Promise<JwtPayload> {
        if (payload.typ !== JWT_TOKEN_TYPE_ACCESS) throw new UnauthorizedException();
        return this.authService.validateJwtPayload(payload);
    }
}
