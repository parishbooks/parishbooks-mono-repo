import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { AllExceptionsFilter, defineLogger, defineThrottler, HealthModule, LoggerModule } from '@parishbooks/core';
import { DatabaseModule } from '@parishbooks/database';
import { config } from '../config';

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
        HealthModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule {}
