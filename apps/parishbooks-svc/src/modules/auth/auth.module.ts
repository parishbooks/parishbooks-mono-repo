import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_STRATEGY_NAME } from './constants';
import { AuthConfig } from '../../config/auth';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRepository } from './repository/auth.repository';
import { SignInService } from './services/signin.service';
import { SignUpService } from './services/signup.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@parishbooks/core';
import { PasswordService } from './services/password.service';

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
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        AuthRepository,
        SignInService,
        SignUpService,
        PasswordService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
})
export class AuthModule {}
