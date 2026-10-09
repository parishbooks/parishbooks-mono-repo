import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_AUDIENCE, JWT_ISSUER } from '../constants';
import { JwtPayload } from '../interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('auth.jwt.secret'),
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            algorithms: ['HS384'],
        });
    }

    override async validate(payload: JwtPayload): Promise<JwtPayload> {
        return {
            sub: payload.sub,
            iss: payload.iss,
            aud: payload.aud,
            iat: payload.iat,
            exp: payload.exp,
        };
    }
}
