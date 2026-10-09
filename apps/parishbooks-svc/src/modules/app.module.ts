import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { CommunicationsModule, EmailService } from '@parishbooks/communications';
import { ClsModule } from 'nestjs-cls';
import { AllExceptionsFilter, AuthGuardModule, defineLogger, defineThrottler, HealthModule, LoggerModule } from '@parishbooks/core';
import { DatabaseModule } from '@parishbooks/database';
import { AUTH_BASE_PATH, defineAuth } from '@parishbooks/iam';
import { config } from '../config';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
    imports: [
        ClsModule.forRoot({ global: true, middleware: { mount: true, generateId: true, saveReq: true } }),
        ConfigModule.forRoot({ isGlobal: true, load: config }),
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => defineLogger({ isProd: configService.get<string>('app.env') === 'production' }),
        }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return defineThrottler({
                    ttl: configService.getOrThrow<number>('throttle.ttl'),
                    limit: configService.getOrThrow<number>('throttle.limit'),
                });
            },
        }),
        DatabaseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                url: configService.getOrThrow<string>('database.url'),
                logging: configService.get<string>('app.env') !== 'production',
            }),
        }),
        CommunicationsModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.getOrThrow<string>('smtp.host'),
                port: configService.getOrThrow<number>('smtp.port'),
                secure: configService.get<boolean>('smtp.secure') ?? true,
                user: configService.getOrThrow<string>('smtp.user'),
                pass: configService.getOrThrow<string>('smtp.pass'),
                from: configService.get<string>('smtp.from') || configService.getOrThrow<string>('smtp.user'),
            }),
        }),
        BetterAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService, EmailService],
            disableGlobalAuthGuard: true,
            useFactory: (configService: ConfigService, emailService: EmailService) => ({
                auth: defineAuth({
                    secret: configService.getOrThrow<string>('iam.secret'),
                    baseURL: configService.get<string>('app.svcUrl') || configService.get<string>('iam.baseUrl') || '',
                    databaseUrl: configService.getOrThrow<string>('database.url'),
                    trustedOrigins: [configService.get<string>('app.uiUrl') ?? `http://localhost:${configService.get<number>('app.uiPort')}`],
                    emailService,
                }),
            }),
        }),
        AuthGuardModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const baseURL = configService.get<string>('app.svcUrl') || configService.get<string>('iam.baseUrl') || '';
                return {
                    jwksUrl: `${baseURL.replace(/\/$/, '')}${AUTH_BASE_PATH}/jwks`,
                    issuer: baseURL.replace(/\/$/, '') || undefined,
                    audience: baseURL.replace(/\/$/, '') || undefined,
                };
            },
        }),
        AuthModule,
        OrganizationModule,
        HealthModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule {}
