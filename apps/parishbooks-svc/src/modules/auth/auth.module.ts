import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { authConfigFromEnv, defineAuth } from '@parishbooks/iam';

@Module({
    imports: [
        BetterAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                auth: defineAuth(
                    authConfigFromEnv({
                        ...process.env,
                        IAM_SECRET: configService.getOrThrow('IAM_SECRET'),
                        DATABASE_URL: configService.getOrThrow('DATABASE_URL'),
                        APP_SVC_URL: configService.get('APP_SVC_URL'),
                        APP_SVC_PORT: configService.get('APP_SVC_PORT'),
                        APP_UI_URL: configService.get('APP_UI_URL'),
                        APP_UI_PORT: configService.get('APP_UI_PORT'),
                        IAM_BASE_URL: configService.get('IAM_BASE_URL'),
                    }),
                ),
            }),
        }),
    ],
})
export class AuthModule {}
