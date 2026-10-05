import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommunicationsModule } from '@parishbooks/communications';
import { AllExceptionsFilter, CorrelationMiddleware, defineLogger, defineThrottler, HealthModule, LoggerModule } from '@parishbooks/core';
import { DatabaseModule } from '@parishbooks/database';
import { validateEnv } from '../config/env.validation';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => defineLogger({ isProd: configService.get('NODE_ENV') === 'production' }),
        }),
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                defineThrottler({
                    ttl: configService.getOrThrow<number>('THROTTLE_TTL'),
                    limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
                }),
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
        AuthModule,
        HealthModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CorrelationMiddleware).forRoutes('*path');
    }
}
