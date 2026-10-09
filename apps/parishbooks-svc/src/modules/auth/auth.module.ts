import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_STRATEGY_NAME } from './constants';
import { AuthConfig } from '../../config/auth';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: JWT_STRATEGY_NAME }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const { jwt } = configService.getOrThrow<AuthConfig>('auth');
                return {
                    secret: jwt.secret,
                    signOptions: { expiresIn: '1d', algorithm: 'HS384', issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
                    verifyOptions: { algorithms: ['HS384'], issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
                };
            },
        }),
    ],
    controllers: [],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
