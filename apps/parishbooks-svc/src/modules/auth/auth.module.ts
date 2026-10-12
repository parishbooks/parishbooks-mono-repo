import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from '@parishbooks/database';
import { JWT_AUDIENCE, JWT_ISSUER, JWT_STRATEGY_NAME } from './constants/jwt.constant';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthRepository } from './repository/auth.repository';
import { VerificationRepository } from './repository/verification.repository';
import { SignInService } from './services/signin.service';
import { SignUpService } from './services/signup.service';
import { VerificationService } from './services/verification.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@parishbooks/core';
import { PasswordService } from './services/password.service';
import { CookieService } from './services/cookie.service';
import { TokenService } from './services/token.service';
import { EMAIL_SENDER } from './ports/email-sender.port';
import { LogEmailSender } from './ports/log-email.sender';

@Module({
    imports: [
        TypeOrmModule.forFeature([Verification]),
        PassportModule.register({ defaultStrategy: JWT_STRATEGY_NAME }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.getOrThrow<string>('auth.jwt.secret'),
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
        VerificationRepository,
        SignInService,
        SignUpService,
        VerificationService,
        PasswordService,
        CookieService,
        TokenService,
        { provide: EMAIL_SENDER, useClass: LogEmailSender },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
})
export class AuthModule {}
