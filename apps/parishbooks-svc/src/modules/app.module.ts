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
import { validateEnv } from '../config/env.validation';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
    imports: [
        ClsModule.forRoot({ global: true, middleware: { mount: true, generateId: true, saveReq: true } }),
        ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => defineLogger({ isProd: configService.get('NODE_ENV') === 'production' }),
        }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return defineThrottler({
                    ttl: configService.getOrThrow<number>('THROTTLE_TTL'),
                    limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
                });
            },
        }),
        DatabaseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                url: configService.getOrThrow<string>('DATABASE_URL'),
                logging: configService.get('NODE_ENV') !== 'production',
            }),
        }),
        CommunicationsModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                host: configService.getOrThrow('SMTP_HOST'),
                port: Number(configService.get('SMTP_PORT') || '465'),
                secure: configService.get('SMTP_SECURE') !== 'false',
                user: configService.getOrThrow('SMTP_USER'),
                pass: configService.getOrThrow('SMTP_PASS'),
                from: configService.get('SMTP_FROM') || configService.getOrThrow('SMTP_USER'),
            }),
        }),
        BetterAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService, EmailService],
            disableGlobalAuthGuard: true,
            useFactory: (configService: ConfigService, emailService: EmailService) => ({
                auth: defineAuth({
                    secret: configService.getOrThrow('IAM_SECRET'),
                    baseURL: configService.get('APP_SVC_URL') || configService.get('IAM_BASE_URL') || '',
                    databaseUrl: configService.getOrThrow('DATABASE_URL'),
                    trustedOrigins: [configService.get('APP_UI_URL') || 'http://localhost:3000'],
                    emailService,
                }),
            }),
        }),
        AuthGuardModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const baseURL = configService.get('APP_SVC_URL') || configService.get('IAM_BASE_URL') || '';
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
