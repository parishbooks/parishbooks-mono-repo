import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { defineAuth } from '@parishbooks/iam';

@Module({
    imports: [
        BetterAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                auth: defineAuth({
                    secret: configService.getOrThrow('IAM_SECRET'),
                    baseURL: configService.get('APP_SVC_URL') || configService.get('IAM_BASE_URL') || '',
                    databaseUrl: configService.getOrThrow('DATABASE_URL'),
                    trustedOrigins: [configService.get('APP_UI_URL') || 'http://localhost:3000'],
                }),
            }),
        }),
    ],
})
export class AuthModule {}
