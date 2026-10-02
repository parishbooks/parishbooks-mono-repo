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
                    }),
                ),
            }),
        }),
    ],
})
export class AuthModule {}
